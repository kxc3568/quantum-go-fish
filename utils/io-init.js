const serverSocket = (app) => {
    app.io.on('connect', (clientSocket) => {
        clientSocket.on("Create Game", data => createGame(data));
        clientSocket.on("Join Game", data => joinGame(data));
        clientSocket.on("Start Game", data => startGame(data));
    });
};

const createGame = ({ nickname }) => {
    // create player, create game with player
};

const joinGame = ({ nickname, code }) => {
    // create player, join game
};

const startGame = ({ code }) => {
    // start the game
};

module.exports = serverSocket;