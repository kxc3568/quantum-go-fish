const Game = require('./Game');

class GameManager {

    constructor() {
        this.games = new Map();
    }

    getGame(code) {
        return this.games.get(code);
    }

    createGame(player) {
        const gameCode = this.generateCode();
        this.games.set(gameCode, new Game(player));
        return gameCode;
    }

    removeGame(code) {
        this.games.delete(code);
    }
}

module.exports = GameManager;