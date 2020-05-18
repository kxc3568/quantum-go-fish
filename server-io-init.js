const serverSocket = (app) => {
    app.io.on('connect', (clientSocket) => {
        console.log('connected');
        clientSocket.on("Create Game", data => app.gm.createGame(data.sid, data.nickname));
        clientSocket.on("Join Game", data => app.gm.getGame(data.code).addPlayer(data.sid, data.nickname));
        clientSocket.on("Start Game", data => app.gm.getGame(data.code).start());
    });
};

module.exports = serverSocket;