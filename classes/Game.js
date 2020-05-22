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

    containsPlayer(nickname) {
        const playersWithNickname = this.players.filter(player => player.nickname === nickname);
        return playersWithNickname.length === 1;
    }

    /**
     * Creates a new player and adds it to the current game
     * @param {Socket} sid          The ID of the socket associated with the player
     * @param {String} nickname     The nickname of the player
     */
    addPlayer(sid, nickname) {
        const newPlayer = new Player(sid, nickname);
        this.players.push(newPlayer);
        return newPlayer;
    }

    /**
     * Removes the player associated with the given nickname from the game
     * @param {String} nickname     The nickname of the player
     */
    removePlayer(nickname) {

    }

    /**
     * Starts a new game round for all players
     */
    start() {
        this.currentRound = new Round(this.players, {});
    }

    /**
     * Retrieves the current round of the game
     */
    getRound() {
        return this.currentRound;
    }
}

module.exports = Game;