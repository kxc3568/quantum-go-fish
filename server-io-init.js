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
    app.io.to(clientSocket.id).emit("Room Code", data.code);
    app.io.in(data.code).emit("Update Players", players);
};

const onStartGame = (app, data) => {
    const game = app.gm.startGame(data.code);
    app.io.in(data.code).emit("Game Started");
    const round = game.getRound();
    app.io.in(data.code).emit("Update Hands", round.getHands());
    app.io.in(data.code).emit("Update Turn", round.getPlayers()[round.advanceTurn()]);
};

const onQuestion = (app, data) => {
    app.io.in(data.room).emit("Question", data);
    const round = app.gm.getGame(data.room).getRound();
    const winner = round.ask(data.questionFrom, data.questionTo, data.suit);
    app.io.in(data.room).emit("Update Hands", round.getHands());
    if (winner !== "") {
        app.io.in(data.room).emit("Winner", winner);
    }
};

const onResponse = (app, data) => {
    const round = app.gm.getGame(data.room).getRound();
    const questionFrom = round.getTurnPlayer();
    const lastAction = round.getLastAction();
    const winner = round.respond(questionFrom, data.responseFrom, data.response, lastAction.suit);
    app.io.in(data.room).emit("Update Hands", round.getHands());
    if (winner !== "") {
        app.io.in(data.room).emit("Winner", winner);
    } else {
        app.io.in(data.room).emit("Update Turn", round.getPlayers()[round.advanceTurn()]);
    }
};

const serverSocket = (app) => {
    app.io.on('connect', (clientSocket) => {
        clientSocket.on("Create Game", data => onCreateGame(app, data, clientSocket));
        clientSocket.on("Join Game", data => onJoinGame(app, data, clientSocket));
        clientSocket.on("Start Game", data => onStartGame(app, data));
        clientSocket.on("Question", data => onQuestion(app, data));
        clientSocket.on("Response", data => onResponse(app, data));
    });
};

module.exports = serverSocket;