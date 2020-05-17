const Game = require('./Game');

class GameManager {

    constructor() {
        this.games = new Map();
    }

    getGame(code) {
        return this.games.get(code);
    }

    createGame(socket, nickname) {
        const gameCode = this.generateCode();
        this.games.set(gameCode, new Game(socket, nickname));
        return gameCode;
    }

    removeGame(code) {
        this.games.delete(code);
    }

    start(code) {

    }
}

module.exports = GameManager;