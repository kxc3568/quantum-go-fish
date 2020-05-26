/**
 * Changes to the view of the game lobby
 */
const toLobbyView = () => {
    hideAll();
    let toShow = document.getElementById("game-container");
    toShow.style.display = "flex";
};

/**
 * Starts the game or displays an error depending on data received from the server
 * @param {Object} data     Contains details about the response of the start game attempt
 */
const processStartGame = (data) => {
    if (data.success) {
        document.getElementsByClassName("hands-container")[0].style.display = "";
        document.getElementsByClassName("round-container")[0].style.display = "none";
        document.getElementsByClassName("history-container")[0].style.display = "flex"
    } else {
        document.getElementById("more-player-error").style.display = "inline";
    }
};

/**
 * Shows the lobby or an error depending on data received from the server
 * @param {Object} data     Contains details about the response of the join attempt
 */
const processJoinResults = (data) => {
    if (data.success) {
        toLobbyView();
    } else if (data.message === "Name") {
        document.getElementById("duplicate-join-name").style.display = "inline";
    } else {
        document.getElementById("invalid-game-code").style.display = "inline";
    }
};

/**
 * Determines if the nickname given is valid
 * @param {String} nickname     The proposed nickname
 */
const validName = (nickname) => {
    if (nickname.length > 1 && nickname.length < 16) {
        return true;
    }
    return false;
};

/**
 * Pings the server socket to create a new Game and populates
 * the game code fields
 */
const createGame = () => {
    const nickname = document.getElementById("create-name").value;
    if (validName(nickname)) {
        socket.nickname = nickname;
        socket.emit("Create Game", { sid: socket.id, nickname: nickname });
        toLobbyView();
    } else {
        const nameError = document.getElementById("invalid-create-name");
        nameError.style.display = "inline";
    }
};

/**
 * Pings the server socket to add a new user to a Game and 
 * populates the game code fields
 */
const joinGame = () => {
    const code = document.getElementById("join-code").value;
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
 * Pings the server socket to start the game for all players
 */
const startGame = () => {
    const code = document.getElementsByClassName("add-code")[0].innerHTML;
    socket.emit("Start Game", { code: code });
};

/**
 * Pings the server to send a question in the socket's room
 */
const askQuestion = () => {
    const ps = document.getElementById("player-select");
    const ss = document.getElementById("suit-select");
    const nickname = ps.options[ps.selectedIndex].value;
    const suit = ss.options[ss.selectedIndex].value;
    const code = document.getElementsByClassName("add-code")[0].innerHTML;
    socket.emit("Question", { room: code, questionFrom: socket.nickname, questionTo: nickname, suit: suit });
};

/**
 * Pings the server to respond to a question in the socket's room
 */
const answerQuestion = () => {
    const rs = document.getElementById("response-select");
    const response = rs.options[rs.selectedIndex].value;
    const code = document.getElementsByClassName("add-code")[0].innerHTML;
    socket.emit("Response", { room: code, response: response, responseFrom: socket.nickname });
};

//
// SOCKET FUNCTIONS
//

/**
 * Populates game code fields with the given code
 * @param {String} code     The code of the game
 */
const populateCode = (code) => {
    const elementsToAdd = Array.from(document.getElementsByClassName("add-code"));
    elementsToAdd.forEach(el => el.innerHTML = code);
};

/**
 * Removes all the children of the given HTML element
 * @param {HTMLElement} el 
 * @param {String} class
 */
const removeAllChildrenWithClass = (el, className) => {
    while (el.lastElementChild && (className === "" || el.lastElementChild.classList.contains(className))) {
        el.removeChild(el.lastElementChild);
    }
};

/**
 * Creates a paragraph node with the given text
 * @param {String} text 
 */
const createRemovableTextNode = (text) => {
    const p = document.createElement("P");
    p.appendChild(document.createTextNode(text));
    return p;
};

/**
 * Updates the lobby player list with the given nickname
 * @param {String} players      The list of current players in the game
 */
const updatePlayerList = (players) => {
    const playerList = document.getElementById("player-list");
    removeAllChildrenWithClass(playerList, "");
    players.forEach((player) => {
        const playerItem = document.createElement("li");
        playerItem.appendChild(document.createTextNode(player.nickname));
        playerList.appendChild(playerItem);
    });
    if (players.length === 1) {
        document.getElementById("more-player-error").style.display = "inline";
    } else {
        document.getElementById("more-player-error").style.display = "none";
    }
};

/**
 * 
 * @param {String} suit 
 * @param {String} status 
 */
const createCard = (suit, status) => {
    const card = document.createElement("div");
    card.classList.add("card", status);
    const centerCard = document.createElement("div");
    centerCard.classList.add("card-center");
    const text = document.createElement("p");
    text.innerHTML = suit;
    centerCard.appendChild(text);
    card.appendChild(centerCard);
    return card;
};
/**
 * Adds the list of cards in hand to the HTML element
 * @param {HTMLElement} el          The HTML Element to append hand markup to
 * @param {Object} hand             Contains an individual socket's nickname and hand
 * @param {Boolean} currentPlayer   Whether the hand is of this socket's player
 */
const appendHandToElement = (el, hand, currentPlayer) => {
    const h = hand.hand;
    const playerName = document.createElement("div");
    playerName.classList.add("player-name");
    const h3Name = document.createElement("h3");
    h3Name.innerHTML = hand.nickname;
    playerName.appendChild(h3Name);

    const playerHand = document.createElement("div");
    Object.keys(h.determined).forEach((suit) => {
        for (let i = 0; i < h.determined[suit]; i++) {
            playerHand.appendChild(createCard(suit, "determined"));
        }
    });
    h.undetermined.forEach(possibleSuits => {
        const undeterminedText = possibleSuits[0].join(", ");
        for (let i = 0; i < possibleSuits[1]; i++) {
            playerHand.appendChild(createCard(undeterminedText, "undetermined"));
        }
    });
    
    const player = document.createElement("div");
    player.appendChild(playerName);
    player.appendChild(playerHand);
    if (currentPlayer) {
        player.classList.add("other-player");
    }
    el.appendChild(player);
};

/**
 * Updates the page with hand markup from all players' hands
 * @param {Object} hands    The hands of all players accessed by Socket ID
 */
const updateHands = (hands) => {
    const handList = document.getElementsByClassName("hands-container")[0];
    removeAllChildrenWithClass(handList, "other-player");
    Object.keys(hands).forEach((sid) => {
        if (sid == socket.id) {
            const yourHand = document.getElementById("current-player");
            removeAllChildrenWithClass(yourHand, "");
            appendHandToElement(yourHand, hands[sid], false);
        } else {
            appendHandToElement(handList, hands[sid], true);
        }
    });
};

/**
 * Adds an option to a select element
 * @param {HTMLElement} select      The HTML select element to add the option to
 * @param {String} optionName       The name of the option element to add
 */
const addOption = (select, optionName) => {
    let opt = document.createElement("OPTION");
    opt.setAttribute("value", optionName);
    opt.innerHTML = optionName;
    select.appendChild(opt);
};

/**
 * Adds the option names to the selector
 * @param {HTMLElement} select      The HTML select element to add options to
 * @param {String[]} optionNames    The names of the option elements to add
 */
const addOptions = (select, optionNames) => {
    optionNames.forEach(name => addOption(select, name));
};

/**
 * Adds options to the player and suit selectors
 */
const populateSelectors = () => {
    const playerSelect = document.getElementById("player-select");
    const suitSelect = document.getElementById("suit-select");
    const playerList = document.getElementById("player-list");
    const playerNames = Array.from(playerList.children).map(el => el.innerHTML).filter(el => el !== socket.nickname);
    const suitNames = [...Array(playerList.children.length).keys()].map(el => el + 1);
    addOptions(playerSelect, playerNames);
    addOptions(suitSelect, suitNames);
};

/**
 * Clears the response containers
 */
const clearResponses = () => {
    document.getElementById("response-select-container").style.display = "none";
    removeAllChildrenWithClass(document.getElementById("response-text"), "");
};

/**
 * Updates the turn and question containers based on who's turn it is
 * @param {Player} player 
 */
const updateTurn = (player) => {
    clearResponses();
    const turnTextContainer = document.getElementById("turn-text");
    const questionContainer = document.getElementById("question-container");
    removeAllChildrenWithClass(turnTextContainer, "");
    let turnText;
    if (player.sid == socket.id) {
        turnText = "Your turn";
        if (document.getElementById("player-select").children.length == 0) {
            populateSelectors();
        }
        questionContainer.style.display = "flex";
    } else {
        turnText = "Waiting for " + player.nickname + " to make a move...";
        questionContainer.style.display = "none";
    }
    turnTextContainer.appendChild(createRemovableTextNode(turnText));
};

/**
 * Hides the question on the page
 */
const clearQuestion = () => {
    const questionContainer = document.getElementById("question-container");
    questionContainer.style.display = "none";
};

/**
 * Updates the response container with response decisions for all players
 * @param {Object} question     Data about the question and players involved
 */
const updateQuestion = (question) => {
    clearQuestion();
    const responseTextContainer = document.getElementById("response-text");
    let text;
    if (question.questionTo === socket.nickname) {
        text = question.questionFrom + " asks if you have any " + question.suit + "s.";
        responseTextContainer.appendChild(createRemovableTextNode(text));
        const responseSelect = document.getElementById("response-select");
        if (responseSelect.children.length == 0) {
            addOption(responseSelect, "Yes");
            addOption(responseSelect, "No");
        }
        document.getElementById("response-select-container").style.display = "block";
    } else {
        text = "Waiting for " + question.questionTo + " to determine if he/she has any " + question.suit + "s...";
        responseTextContainer.appendChild(createRemovableTextNode(text));
    }
    responseTextContainer.style.display = "block";
};

/**
 * Updates page with the winner of the game
 * @param {String} winner   The nickname of the winner of the game
 */
const updateWinner = (winner) => {
    document.getElementsByClassName("round-container")[0].style.display = "block";
    document.getElementsByClassName("hands-container")[0].style.display = "none";
    document.getElementsByClassName("game-end")[0].style.display = "flex";
    const playerResult = document.getElementsByClassName("player-result")[0];
    removeAllChildrenWithClass(playerResult, "");
    playerResult.appendChild(createRemovableTextNode(winner + " has won 🤩"));
    playerResult.appendChild(createRemovableTextNode("what a big brain!"));
    const scoreResult = document.getElementsByClassName("score-result")[0];
    removeAllChildrenWithClass(scoreResult, "");
    scoreResult.appendChild(createRemovableTextNode(winner + " has earned 3 points."));
};

/**
 * Updates page with the player that made an illegal move
 * @param {String} loser    The nickname of the player that made an illegal move
 */
const updateLoser = (loser) => {
    document.getElementsByClassName("round-container")[0].style.display = "block";
    document.getElementsByClassName("hands-container")[0].style.display = "none";
    document.getElementsByClassName("game-end")[0].style.display = "flex";
    const playerResult = document.getElementsByClassName("player-result")[0];
    removeAllChildrenWithClass(playerResult, "");
    playerResult.appendChild(createRemovableTextNode("oh no 🤒"));
    playerResult.appendChild(createRemovableTextNode(loser + " has made an illegal move!"));
    const scoreResult = document.getElementsByClassName("score-result")[0];
    removeAllChildrenWithClass(scoreResult, "");
    scoreResult.appendChild(createRemovableTextNode(loser + " has lost 1 point."));
};

/**
 * Initializes the global client socket message listeners
 */
const socketInit = () => {
    socket.on("Room Code", code => populateCode(code));
    socket.on("Joined Game", data => processJoinResults(data));
    socket.on("Update Players", players => updatePlayerList(players));
    socket.on("Game Started", data => processStartGame(data));
    socket.on("Update Hands", hands => updateHands(hands));
    socket.on("Update Turn", player => updateTurn(player));
    socket.on("Question", question => updateQuestion(question));
    socket.on("Winner", winner => updateWinner(winner));
    socket.on("Illegal Move", loser => updateLoser(loser));
};

const socket = io.connect();
socketInit(socket);
document.getElementsByClassName("hands-container")[0].style.display = "none";