const Game = require('./Game');

class GameManager {

    constructor() {
        this.games = new Map();
    }

    /**
     * returns the Game object associated with the given code and undefined if there is no existing game
     * @param {String} code 
     */
    getGame(code) {
        return this.games.get(code);
    }

    /**
     * Generates a new, unique game code
     */
    generateCode() {
        let gameCode = "";
        do {
            for (let i = 0; i < 4; i++) {
                gameCode += String.fromCharCode(Math.floor(Math.random() * 26 + 97));
            }
        } while (this.getGame(gameCode) !== undefined)
        return gameCode;
    }

    /**
     * Creates a new game from a player's credentials
     */
    createGame(sid, nickname) {
        const gameCode = this.generateCode();
        this.games.set(gameCode, new Game(sid, nickname));
        return gameCode;
    }

    /**
     * Removes the Game associated with the given code from the list of active games
     * @param {String} code 
     */
    removeGame(code) {
        this.games.delete(code);
    }

    /**
     * Starts the Game associated with the given code
     * @param {String} code 
     */
    start(code) {

    }
}

module.exports = GameManager;