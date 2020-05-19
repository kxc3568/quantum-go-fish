const Player = require('./Player');
const Round = require('./Round');

class Game {
    
    constructor(sid, nickname) {
        this.currentRound = null;
        this.players = [new Player(sid, nickname)];
    }

    /**
     * Retrieves list of current players
     */
    getPlayers() {
        return this.players;
    }

    /**
     * Creates a new player and adds it to the current game
     * @param {Socket} sid 
     * @param {String} nickname 
     */
    addPlayer(sid, nickname) {
        const newPlayer = new Player(sid, nickname);
        this.players.push(newPlayer);
        return newPlayer;
    }

    /**
     * Removes the player associated with the given nickname from the game
     * @param {String} nickname 
     */
    removePlayer(nickname) {

    }

    /**
     * Starts a new game round for all players
     */
    start() {
        this.currentRound = new Round(this.players, {});
    }
}

module.exports = Game;