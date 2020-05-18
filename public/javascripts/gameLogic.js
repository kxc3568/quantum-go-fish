const socket = io.connect();

/**
 * Populates game code fields with the given code
 * @param {String} code 
 */
const populateCode = (code) => {

};

/**
 * Pings the server socket to create a new Game and populates
 * the game code fields
 */
const createGame = () => {
    const nickname = document.getElementById("createName").value;
    socket.emit("Create Game", { sid: socket.id, nickname: nickname });
};

/**
 * Pings the server socket to add a new user to a Game and 
 * populates the game code fields
 */
const joinGame = () => {
    const code = document.getElementById("joinCode").value;
    const nickname = document.getElementById("joinName").value;
    socket.emit("Join Game", { sid: socket.id, nickname: nickname, code: code });
};

/**
 * Pings the server socket to start the game for all players
 */
const startGame = () => {

};