/**
 * Populates game code fields with the given code
 * @param {String} code 
 */
const populateCode = (code) => {
    const elementsToAdd = Array.from(document.getElementsByClassName("add-code"));
    elementsToAdd.forEach(el => el.innerHTML = code);
};

/**
 * Determines if the nickname given is valid
 * @param {String} nickname 
 */
const validName = (nickname) => {
    if (nickname.length > 1 && nickname.length < 16) {
        return true;
    }
    return false;
}

/**
 * Updates the lobby player list with the given nickname
 * @param {String} nickname 
 */
const updatePlayerList = (nickname) => {
    const playerList = document.getElementById("player-list");
    const playerItem = document.createElement("li");
    playerItem.appendChild(document.createTextNode(nickname));
    playerList.appendChild(playerItem);
};

const addInitialPlayers = (players) => {
    players.forEach(player => updatePlayerList(player.nickname));
};

/**
 * Pings the server socket to create a new Game and populates
 * the game code fields
 */
const createGame = () => {
    const nickname = document.getElementById("create-name").value;
    if (validName(nickname)) {
        updatePlayerList(nickname);
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
        populateCode(code);
    } else {
        const nameError = document.getElementById("invalid-joinname");
        nameError.style.display = "inline";
    }
};

/**
 * Pings the server socket to start the game for all players
 */
const startGame = () => {

};

/**
 * Initializes client socket message listeners
 * @param {Socket} socket 
 */
const socketInit = (socket) => {
    socket.on("Room Code", code => populateCode(code));
    socket.on("Initial State", players => addInitialPlayers(players));
    socket.on("Update Players", nickname => updatePlayerList(nickname));
};

const socket = io.connect();
socketInit(socket);