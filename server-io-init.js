const onCreateGame = (app, data, clientSocket) => {
    const { code, players } = app.gm.createGame(data.sid, data.nickname);
    clientSocket.join(code);
    app.io.to(clientSocket.id).emit("Room Code", code);
    app.io.to(clientSocket.id).emit("Update Players", players);
};

const onJoinGame = (app, data, clientSocket) => {
    clientSocket.join(data.code);
    const game = app.gm.getGame(data.code);
    game.addPlayer(data.sid, data.nickname);
    const players = game.getPlayers();
    app.io.in(data.code).emit("Update Players", players);
};

const serverSocket = (app) => {
    app.io.on('connect', (clientSocket) => {
        clientSocket.on("Create Game", data => onCreateGame(app, data, clientSocket));
        clientSocket.on("Join Game", data => onJoinGame(app, data, clientSocket));
        clientSocket.on("Start Game", data => app.gm.getGame(data.code).start());
    });
};

module.exports = serverSocket;