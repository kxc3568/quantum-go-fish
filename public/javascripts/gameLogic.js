/*
    TABLE OF CONTENTS

    1. UTILITY FUNCTIONS
    2. VIEW CHANGE FUNCTIONS
    3. FUNCTIONS THAT EMIT TO SERVER
    4. FUNCTIONS THAT PROCESS SERVER COMMUNICATION

*/

/*
    UTILITY FUNCTIONS
*/

/**
 * Removes all the children of the given HTML element with the given class;
 * removes all children if class is empty string.
 * @param {HTMLElement} el      The element to have it's children removed
 * @param {String} class        The class to look for to remove
 */
const removeAllChildrenWithClass = (el, className) => {
    while (el.lastElementChild && (className === "" || el.lastElementChild.classList.contains(className))) {
        el.removeChild(el.lastElementChild);
    }
};

/**
 * Creates a paragraph node with the given text.
 * @param {String} text     The text content of the paragraph node to be made
 */
const createRemovableTextNode = (text) => {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(text));
    return p;
};

/*
    VIEW CHANGE FUNCTIONS
*/

/**
 * Listens to input changes in the create name to determine if the length is valid for the game
 * to be created and sets the buttons activity based on that.
 */
const updateCreateButton = () => {
    const createName = document.getElementById("create-name").value;
    const createGameBtn = document.getElementById("create-game-btn");
    if (createName.length >= 2 && createName.length <= 15) {
        createGameBtn.removeAttribute("disabled");
    } else {
        createGameBtn.setAttribute("disabled", "true");
    }
};

/**
 * Listens to input changes in the join name to determine if the length is valid for the game
 * to be created and sets the buttons activity based on that.
 */
const updateJoinButton = () => {
    const joinName = document.getElementById("join-name").value;
    const joinCode = document.getElementById("join-code").value;
    const joinGameBtn = document.getElementById("join-game-btn");
    if (joinName.length >= 2 && joinName.length <= 15 && joinCode.length === 4) {
        joinGameBtn.removeAttribute("disabled");
    } else {
        joinGameBtn.setAttribute("disabled", "true");
    }
};

/**
 * Toggles the display of the scores.
 */
const toggleScores = () => {
    const scores = document.getElementsByClassName("scores")[0];
    if (scores.style.display === "none") {
        scores.style.display = "";
    } else {
        scores.style.display = "none";
    }
};

/**
 * Toggles the display of game history.
 */
const toggleHistory = () => {
    const history = document.getElementsByClassName("history")[0];
    if (history.style.display === "none") {
        history.style.display = "";
    } else {
        history.style.display = "none";
    }
};

/**
 * Changes display of all content container elements to none.
 */
const hideAll = () => {
    let hide = Array.from(document.getElementsByClassName("content-container"));
    hide.forEach(el => el.style.display = "none");
};

/**
 * Changes from landing page view to creating game view.
 */
const createGameView = () => {
    hideAll();
    let toShow = document.getElementById("create-game-container");
    toShow.style.display = "flex";
};

/**
 * Changes from landing page view to joining game view.
 */
const joinGameView = () => {
    hideAll();
    let toShow = document.getElementById("join-game-container");
    toShow.style.display = "flex";
};

/**
 * Changes from creating or joining game view to landing view.
 */
const toHomeView = () => {
    hideAll();
    let toShow = document.getElementById("landing-container");
    toShow.style.display = "flex";
};

/**
 * Changes to the view of the game lobby.
 */
const toLobbyView = () => {
    hideAll();
    let toShow = document.getElementById("game-container");
    toShow.style.display = "";
};

/*
    FUNCTIONS THAT EMIT TO SERVER
*/

/**
 * Determines if the nickname given is valid.
 * @param {String} nickname     The proposed nickname
 */
const validName = (nickname) => {
    if (nickname.length > 1 && nickname.length < 21) {
        return true;
    }
    return false;
};

/**
 * Pings the server socket to create a new Game and populates the game code fields if there is
 * a valid name entered. Displays an error otherwise.
 */
const createGame = () => {
    const nickname = document.getElementById("create-name").value;
    if (validName(nickname)) {
        socket.nickname = nickname;
        socket.emit("Create Game", { 
            sid: socket.id,
            nickname: nickname,
            settings: {
                determineSuits: document.getElementById("setting-determined").checked,
                showHistory: document.getElementById("setting-history").checked
            }
        });
        toLobbyView();
    } else {
        const nameError = document.getElementById("invalid-create-name");
        nameError.style.display = "inline";
    }
};

/**
 * Pings the server socket to add a new user to a Game and populates the game code fields if
 * there is a valid name entered. Displays an error otherwise.
 */
const joinGame = () => {
    const code = document.getElementById("join-code").value.toLowerCase();
    const nickname = document.getElementById("join-name").value;
    if (validName(nickname)) {
        socket.nickname = nickname;
        socket.emit("Join Game", { sid: socket.id, nickname: nickname, code: code });
    } else {
        const nameError = document.getElementById("invalid-join-name");
        nameError.style.display = "inline";
    }
};

/**
 * Pings the server socket to start the game for all players if there are enough players. 
 * Displays an error otherwise.
 */
const startGame = () => {
    if (document.getElementById("player-list").children.length < 2) {
        document.getElementById("more-player-error").style.display = "inline";
    } else {
        socket.emit("Start Game");
    }
};

/**
 * Pings the server to send a question in the socket's room based on the decisions of the player.
 */
const askQuestion = () => {
    const ps = document.getElementById("player-select");
    const ss = document.getElementById("suit-select");
    const nickname = ps.options[ps.selectedIndex].value;
    const suit = ss.options[ss.selectedIndex].value;
    socket.emit("Question", { questionFrom: socket.nickname, questionTo: nickname, suit: suit });
};

/**
 * Pings the server to respond to a question in the socket's room based on the decision of the player.
 */
const answerQuestion = () => {
    const rs = document.getElementById("response-select");
    const response = rs.options[rs.selectedIndex].value;
    socket.emit("Response", { response: response, responseFrom: socket.nickname });
};

/*
    FUNCTIONS THAT PROCESS SERVER COMMUNICATION

    In order of socket events:
    socket.on("Room Code", code => populateCode(code));
    socket.on("Joined Game", data => processJoinResults(data));
    socket.on("In Progress", showGameInProgress);
    socket.on("Update Players", players => updatePlayerList(players));
    socket.on("Game Started", toStartView);
    socket.on("Update Hands", hands => updateHands(hands));
    socket.on("Update Turn", player => updateTurn(player));
    socket.on("Update History", history => updateHistory(history));
    socket.on("Question", question => updateQuestion(question));
    socket.on("Winner", winner => updateWinner(winner));
    socket.on("Illegal Move", loser => updateLoser(loser));
*/

/**
 * Adds the names and scores to the player's list and the score's list.
 * @param {HTMLElement} playerList      The player list element
 * @param {HTMLElement} scoresList      The score list element
 * @param {Player[]} players            The list of players and their scores.
 */
const addPlayersAndScores = (playerList, scoresList, players) => {
    players.forEach((player) => {
        const playerItem = document.createElement("li");
        playerItem.appendChild(document.createTextNode(player.nickname));
        playerList.appendChild(playerItem);
        scoresList.appendChild(createRemovableTextNode(player.nickname));
        scoresList.appendChild(createRemovableTextNode(player.score));
    });
};

/**
 * Disables the view of the history of moves and deductions
 */
const disableHistory = () => {
    historyDisabled = true;
};

/**
 * Creates a player marker element for a player for the game display.
 * @param {String} nickname     The name of the player to create an element for.
 */
const createPlayerName = (nickname) => {
    const playerName = document.createElement("div");
    playerName.classList.add("player-name");
    const h3Name = document.createElement("h3");
    h3Name.innerHTML = nickname;
    playerName.appendChild(h3Name);
    return playerName;
};

/**
 * Creates a card element for the game display.
 * @param {String} suit 
 * @param {String} status 
 */
const createCard = (suit, status) => {
    const card = document.createElement("div");
    card.classList.add("card", status);
    const centerCard = document.createElement("div");
    centerCard.classList.add("card-center");
    centerCard.appendChild(createRemovableTextNode(suit));
    card.appendChild(centerCard);
    return card;
};

/**
 * Creates card elements for the determined cards in the hand and appends them to the 
 * hand element.
 * @param {HTMLElement} playerHand      The hand element of the player
 * @param {Object} determined           The determined cards in the hand
 */
const addDetermined = (playerHand, determined) => {
    Object.keys(determined).forEach((suit) => {
        for (let i = 0; i < determined[suit]; i++) {
            playerHand.appendChild(createCard(suit, "determined"));
        }
    });
};

/**
 * Creates card elements for the undetermined cards in the hand and appends them to the 
 * hand element.
 * @param {HTMLElement} playerHand      The hand element of the player
 * @param {Array[]} undetermined        The undetermined cards in the hand
 */
const addUndetermined = (playerHand, undetermined) => {
    undetermined.forEach(possibleSuits => {
        const undeterminedText = possibleSuits[0].join(", ");
        for (let i = 0; i < possibleSuits[1]; i++) {
            playerHand.appendChild(createCard(undeterminedText, "undetermined"));
        }
    });
};

/**
 * Creates the hand element for a player for the game display.
 * @param {Hand} hand       The object that contains details about a player's hand
 */
const createPlayerHand = (hand) => {
    const playerHand = document.createElement("div");
    playerHand.classList.add("player-hand");

    addDetermined(playerHand, hand.determined);
    addUndetermined(playerHand, hand.undetermined);
    return playerHand;
};

/**
 * Adds the list of cards in hand to the HTML element.
 * @param {HTMLElement} el          The HTML Element to append hand markup to
 * @param {Object} hand             Contains an individual socket's nickname and hand
 * @param {Boolean} otherPlayer     Whether the hand is of another socket's player
 */
const appendHandToElement = (el, hand, otherPlayer) => {
    const player = document.createElement("div");
    player.appendChild(createPlayerName(hand.nickname));
    player.appendChild(createPlayerHand(hand.hand));
    if (otherPlayer) {
        player.classList.add("other-player");
    }
    el.appendChild(player);
};

/**
 * Adds an option to a select element.
 * @param {HTMLElement} select      The HTML select element to add the option to
 * @param {String} optionName       The name of the option element to add
 */
const addOption = (select, optionName) => {
    let opt = document.createElement("option");
    opt.setAttribute("value", optionName);
    opt.innerHTML = optionName;
    select.appendChild(opt);
};

/**
 * Adds the option names to the selector.
 * @param {HTMLElement} select      The HTML select element to add options to
 * @param {String[]} optionNames    The names of the option elements to add
 */
const addOptions = (select, optionNames) => {
    optionNames.forEach(name => addOption(select, name));
};

/**
 * Adds options to the player and suit selectors.
 */
const populateSelectors = () => {
    const playerList = document.getElementById("player-list");
    const playerSelect = document.getElementById("player-select");
    const suitSelect = document.getElementById("suit-select");
    const playerNames = Array.from(playerList.children).map(el => el.innerHTML).filter(el => el !== socket.nickname);
    const suitNames = [...Array(playerList.children.length).keys()].map(el => el + 1);
    addOptions(playerSelect, playerNames);
    addOptions(suitSelect, suitNames);
};

/**
 * Clears the response containers.
 */
const clearResponses = () => {
    document.getElementById("response-select-container").style.display = "none";
    removeAllChildrenWithClass(document.getElementById("response-text"), "");
};

/**
 * Returns a description of the event that occurred in entry.
 * @param {Object} entry    An object details an event that occurred in the game
 */
const makeEntry = (entry) => {
    switch (entry.type) {
        case "Question":
            return "Question: " + entry.from + " asked " + entry.to + " for " + entry.suit + "s";
        case "Response":
            if (entry.res === "Yes") {
                return "Response: " + entry.from + " has a " + entry.suit + " and gave it to " + entry.to + ".";
            } else {
                return "Response: " + entry.from + " claimed to have no " + entry.suit + "s. Go fish!";
            }
        case "Deduction":
            return "Deduction: " + entry.player + " was determined to only have " + entry.number + " more possible " + entry.suit + "(s)!";
        default:
            return "Something went wrong in the history machine :(";
    }
};

/**
 * Hides the question on the page.
 */
const clearQuestion = () => {
    const questionContainer = document.getElementById("question-container");
    questionContainer.style.display = "none";
};

/**
 * Shows the question's response for a player.
 */
const showResponseSelect = () => {
    const responseSelect = document.getElementById("response-select");
    if (responseSelect.children.length == 0) {
        addOption(responseSelect, "Yes");
        addOption(responseSelect, "No");
    }
    document.getElementById("response-select-container").style.display = "block";
};
