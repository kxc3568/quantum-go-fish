const Game = require('./Game');

class GameManager {

    constructor() {
        this.games = new Map();
    }

    /**
     * returns the Game object associated with the given code and undefined if there is no existing game
     * @param {String} code     The code of the game to retrieve
     */
    getGame(code) {
        return this.games.get(code);
    }

    /**
     * Generates a new, unique game code
     */
    generateCode() {
        let code = "";
        do {
            for (let i = 0; i < 4; i++) {
                code += String.fromCharCode(Math.floor(Math.random() * 26 + 97));
            }
        } while (this.getGame(code) !== undefined)
        return code;
    }

    /**
     * Creates a new game from a player's credentials
     * @param {Socket ID} sid       ID of the socket associated with the player that created the game
     * @param {String} nickname     The player that created the game's nickname
     */
    createGame(sid, nickname, settings) {
        const code = this.generateCode();
        this.games.set(code, new Game(sid, nickname, settings));
        return { code: code, players: this.games.get(code).getPlayers() };
    }

    /**
     * Removes the Game associated with the given code from the list of active games
     * @param {String} code     The code of the game to be deleted
     */
    removeGame(code) {
        this.games.delete(code);
    }

    /**
     * Starts the Game associated with the given code
     * @param {String} code     The code of the game to start
     */
    startGame(code) {
        const game = this.getGame(code);
        game.start();
        return game;
    }
}

module.exports = GameManager;