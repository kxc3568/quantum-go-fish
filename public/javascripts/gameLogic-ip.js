/*
    INITIAL PAINT JS
*/ 

/**
 * Populates game code fields with the given code.
 * @param {String} code     The code of the game
 */
const populateCode = (code) => {
    const elementsToAdd = Array.from(document.getElementsByClassName("add-code"));
    elementsToAdd.forEach(el => el.innerHTML = code);
};

/**
 * Shows the lobby or an error depending on data received from the server.
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
 * Displays an error that a game is currently in progress.
 */
const showGameInProgress = () => {
    document.getElementById("game-in-progress").style.display = "inline";
};

/**
 * Updates the lobby player list and the game score list with the given nickname (and scores).
 * @param {Player[]} players      The list of current players in the game
 */
const updatePlayerList = (players) => {
    const playerList = document.getElementById("player-list");
    removeAllChildrenWithClass(playerList, "");
    const scoresList = document.getElementsByClassName("scores")[0];
    removeAllChildrenWithClass(scoresList, "");

    addPlayersAndScores(playerList, scoresList, players);
    if (players.length === 1) {
        document.getElementById("more-player-error").style.display = "inline";
    } else {
        document.getElementById("more-player-error").style.display = "none";
    }
};

/**
 * Changes from lobby view to the game view.
 */
const toStartView = () => {
    document.getElementsByClassName("hands-container")[0].style.display = "";
    document.getElementsByClassName("round-container")[0].style.display = "none";
    document.getElementsByClassName("history-container")[0].style.display = "flex";
    document.getElementsByClassName("score-container")[0].style.display = "flex";
    document.getElementsByClassName("score-history-container")[0].style.display = "";
};

/**
 * Updates the page with hand markup from all players' hands.
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
 * Updates the turn and question containers based on who's turn it is.
 * @param {Player} player       The player who's turn it is
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
 * Updates the history display with the events that have occurred in the game.
 * @param {Object[]} history    The events that have happened in the course of a game
 */
const updateHistory = (history) => {
    const historyContainer = document.getElementsByClassName("history")[0]; 
    removeAllChildrenWithClass(historyContainer, "");

    if (history.length === 0) {
        historyContainer.appendChild(createRemovableTextNode("Make a move to see the history!"))
    } else if (history[0].type === "Disabled") {
        historyContainer.appendChild(createRemovableTextNode("You've disabled viewing history, sorry!"))
    } else {
        history.forEach(entry => historyContainer.appendChild(createRemovableTextNode(makeEntry(entry))));
    }
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
        showResponseSelect();
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
    scoreResult.appendChild(createRemovableTextNode(winner + " has earned 2 points."));
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
    socket.on("In Progress", showGameInProgress);
    socket.on("Update Players", players => updatePlayerList(players));
    socket.on("Game Started", toStartView);
    socket.on("Update Hands", hands => updateHands(hands));
    socket.on("Update Turn", player => updateTurn(player));
    socket.on("Update History", history => updateHistory(history));
    socket.on("Question", question => updateQuestion(question));
    socket.on("Winner", winner => updateWinner(winner));
    socket.on("Illegal Move", loser => updateLoser(loser));
};

/**
 * Initializes the display of the page on landing.
 */
const viewInit = () => {
    document.getElementsByClassName("hands-container")[0].style.display = "none";
    document.getElementById("game-container").style.display = "none";
    if (window.getComputedStyle(document.getElementsByClassName("score-history-label-button")[0]).getPropertyValue("display") !== "none") {
        document.getElementsByClassName("scores")[0].style.display = "none";
        document.getElementsByClassName("history")[0].style.display = "none";
    }
    document.getElementsByClassName("score-history-container")[0].style.display = "none";
};

const socket = io.connect();
socketInit();
let historyDisabled = false;
viewInit();
