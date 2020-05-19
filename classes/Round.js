class Round {

    constructor(players, settings) {
        this.players = players;
        this.turn = 0;
        this.settings = settings;
        this.startRound();
    }

    /**
     * Initialize starting settings and hands for the round
     */
    startRound() {
        this.players.forEach(player => player.initHand(settings.suits));
    }

    /**
     * Determines or narrows values of playerFrom's and playerTo's hands based on the 
     * question and response from the players
     * @param {Player} playerFrom 
     * @param {Player} playerTo 
     * @param {String} suit 
     */
    ask(playerFrom, playerTo, suit) {

    }
}

module.exports = Round;