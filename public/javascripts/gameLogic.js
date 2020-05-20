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
        socket.emit("Create Game", { sid: socket.id, nickname: nickname });
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
        socket.emit("Join Game", { sid: socket.id, nickname: nickname, code: code });
    } else {
        const nameError = document.getElementById("invalid-joinname");
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
 */
const removeAllChildren = (el) => {
    while (el.lastElementChild) {
        el.removeChild(playerList.lastElementChild);
    }
}

/**
 * Updates the lobby player list with the given nickname
 * @param {String} players      The list of current players in the game
 */
const updatePlayerList = (players) => {
    const playerList = document.getElementById("player-list");
    removeAllChildren(playerList);
    players.forEach((player) => {
        const playerItem = document.createElement("li");
        playerItem.appendChild(document.createTextNode(player.nickname));
        playerList.appendChild(playerItem);
    });
};

/**
 * Changes to the view of the started game
 */
const toGameView = () => {
    hideAll();
    let toShow = document.getElementById("game-container");
    toShow.style.display = "block";
};

/**
 * 
 * @param {HTMLElement} el  The HTML Element to append hand markup to
 * @param {Object} hand     Contains an individual socket's nickname and hand
 */
const appendHandToElement = (el, hand) => {
    let handText = hand.nickname;
    Object.keys(hand.hand.determined).forEach(key => {
        for (let i = 0; i < hand.hand.determined.get(key); i++) {
            handText += " " + key;
        }
    });
    for (let i = 0; i < hand.hand.undetermined.numCards; i++) {
        handText += " blank";
    }
    el.appendChild(document.createTextNode(handText));
};

/**
 * Updates the page with hand markup from all players' hands
 * @param {Object} hands    The hands of all players accessed by Socket ID
 */
const updateHands = (hands) => {
    const handList = document.getElementById("other-players");
    removeAllChildren(handList);
    Object.keys(hands).forEach((sid) => {
        if (sid == socket.id) {
            const yourHand = document.getElementById("your-hand");
            removeAllChildren(yourHand);
            appendHandToElement(yourHand, hands[sid]);
        } else {
            const playerHand = document.createElement("li");
            appendHandToElement(playerHand, hands[sid]);
            handList.appendChild(playerHand);
        }
    });
};

const updateTurn = (player) => {
    const turnContainer = document.getElementById("turn-container");
    removeAllChildren(turnContainer);
    let turnText;
    if (player.sid == socket.id) {
        turnText = "Your turn";
    } else {
        turnText = "Waiting for " + player.nickname + " to make a move...";
    }
    turnContainer.appendChild(document.createTextNode(turnText));
};

/**
 * Initializes the global client socket message listeners
 */
const socketInit = () => {
    socket.on("Room Code", code => populateCode(code));
    socket.on("Update Players", players => updatePlayerList(players));
    socket.on("Game Started", toGameView);
    socket.on("Update Hands", hands => updateHands(hands));
    socket.on("Update Turn", player => updateTurn(player));
};

const socket = io.connect();
socketInit(socket);