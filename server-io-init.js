const onCreateGame = (app, data, clientSocket) => {
    const gameCode = app.gm.createGame(data.sid, data.nickname);
    clientSocket.join(gameCode);
    app.io.to(clientSocket.id).emit("Room Code", gameCode);
}

const onJoinGame = (app, data, clientSocket) => {
    const game = app.gm.getGame(data.code);
    const player = game.addPlayer(data.sid, data.nickname);
    const players = game.getPlayers();
    app.io.to(clientSocket.id).emit("Initial State", players);
    clientSocket.in(data.code).broadcast.emit("Update Players", player.nickname);
}

const serverSocket = (app) => {
    app.io.on('connect', (clientSocket) => {
        clientSocket.on("Create Game", data => onCreateGame(app, data, clientSocket));
        clientSocket.on("Join Game", data => onJoinGame(app, data, clientSocket));
        clientSocket.on("Start Game", data => app.gm.getGame(data.code).start());
    });
};

module.exports = serverSocket;