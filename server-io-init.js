const onCreateGame = (app, data, clientSocket) => {
    const { code, players } = app.gm.createGame(data.sid, data.nickname, data.settings);
    clientSocket.join(code);
    clientSocket.room = code;
    app.io.to(clientSocket.id).emit("Room Code", clientSocket.room);
    app.io.to(clientSocket.id).emit("Update Players", players);
};

const onJoinGame = (app, data, clientSocket) => {
    clientSocket.join(data.code);
    clientSocket.room = data.code;
    const game = app.gm.getGame(clientSocket.room);
    if (game === undefined) {
        app.io.to(clientSocket.id).emit("Joined Game", { success: false, message: "Code" });
    } else if (game.containsPlayer(data.nickname)) {
        app.io.to(clientSocket.id).emit("Joined Game", { success: false, message: "Name" });
    } else {
        game.addPlayer(data.sid, data.nickname);
        const players = game.getPlayers();
        app.io.to(clientSocket.id).emit("Joined Game", { success: true, message: "" });
        app.io.to(clientSocket.id).emit("Room Code", clientSocket.room);
        app.io.in(clientSocket.room).emit("Update Players", players);
    }
};

const onStartGame = (app, clientSocket) => {
    const game = app.gm.startGame(clientSocket.room);
    if (game.getPlayers().length < 2) {
        app.io.in(clientSocket.room).emit("Game Started", { success: false })
    } else {
        app.io.in(clientSocket.room).emit("Game Started", { success: true });
        const round = game.getRound();
        app.io.in(clientSocket.room).emit("Update Hands", round.getHands());
        app.io.in(clientSocket.room).emit("Update Turn", round.getPlayers()[round.advanceTurn()]);
        if (!round.getSettings().showHistory) {
            app.io.in(clientSocket.room).emit("Disable History");
        }
    }
};

const onQuestion = (app, data, clientSocket) => {
    app.io.in(clientSocket.room).emit("Question", data);
    const round = app.gm.getGame(clientSocket.room).getRound();
    const winner = round.ask(data.questionFrom, data.questionTo, data.suit);
    app.io.in(clientSocket.room).emit("Update Hands", round.getHands());
    if (winner === "Illegal Question") {
        app.io.in(clientSocket.room).emit("Illegal Move", data.questionFrom);
        app.io.in(clientSocket.room).emit("Update Players", round.getPlayers());
    } else if (winner !== "") {
        app.io.in(clientSocket.room).emit("Winner", winner);
        app.io.in(clientSocket.room).emit("Update Players", round.getPlayers());
    }
};

const onResponse = (app, data, clientSocket) => {
    const round = app.gm.getGame(clientSocket.room).getRound();
    const questionFrom = round.getTurnPlayer();
    const lastAction = round.getLastNonDeductionAction();
    const winner = round.respond(questionFrom, data.responseFrom, data.response, lastAction.suit);
    app.io.in(clientSocket.room).emit("Update Hands", round.getHands());
    if (winner === "Illegal Response") {
        app.io.in(clientSocket.room).emit("Illegal Move", data.responseFrom);
        app.io.in(clientSocket.room).emit("Update Players", round.getPlayers());
    } else if (winner !== "") {
        app.io.in(clientSocket.room).emit("Winner", winner);
        app.io.in(clientSocket.room).emit("Update Players", round.getPlayers());
    } else {
        app.io.in(clientSocket.room).emit("Update Turn", round.getPlayers()[round.advanceTurn()]);
    }
};

const onDisconnect = (app, clientSocket) => {
    if (clientSocket.room) {
        const game = app.gm.getGame(clientSocket.room);
        game.removePlayer(clientSocket.id);
        app.io.in(clientSocket.room).emit("Update Players", game.getPlayers());
    }
};

const serverSocket = (app) => {
    app.io.on('connect', (clientSocket) => {
        clientSocket.on("Create Game", data => onCreateGame(app, data, clientSocket));
        clientSocket.on("Join Game", data => onJoinGame(app, data, clientSocket));
        clientSocket.on("Start Game", () => onStartGame(app, clientSocket));
        clientSocket.on("Question", data => onQuestion(app, data, clientSocket));
        clientSocket.on("Response", data => onResponse(app, data, clientSocket));
        clientSocket.on("disconnect", () => onDisconnect(app, clientSocket));
    });
};

module.exports = serverSocket;