class Round {

    constructor(players, settings) {
        this.players = players;
        this.turn = Math.floor(Math.random() * players.length);
        this.settings = settings;
        this.startRound();
    }

    /**
     * Retrieves list of current players
     */
    getPlayers() {
        return this.players;
    }

    /**
     * Retrieves the hands of the current players
     */
    getHands() {
        const hands = {};
        this.getPlayers().forEach(player => hands[player.sid] = { nickname: player.nickname, hand: player.getHand() });
        return hands;
    }

    /**
     * Initialize starting settings and hands for the round
     */
    startRound() {
        this.players.forEach(player => player.initHand(this.settings.suits));
    }

    /**
     * Advances the round turn to the next player
     */
    advanceTurn() {
        this.turn += 1;
        this.turn %= this.players.length;
        return this.turn;
    }

    /**
     * Determines values of playerFrom's hand based on the question
     * @param {Player} playerFrom   The player that asked the question
     * @param {String} suit         The suit that is being asked
     */
    ask(playerFrom, suit) {
        playerFrom.determine(suit);
    }

    /**
     * Determines or narrows values of playerTo's hand based on playerTo's response
     * to playerFrom's question. Processes transferring of cards between players.
     * @param {Player} playerFrom   The player that asked the question
     * @param {Player} playerTo     The player that was asked the question
     * @param {String} res          Whether the player has the card or not
     * @param {String} suit         The suit that is being asked
     */
    respond(playerFrom, playerTo, res, suit) {
        if (res == "yes") {
            playerTo.determine(suit);
            playerTo.transferCard(playerFrom, suit);
        } else {
            playerTo.narrow(suit);
        }
    }
}

module.exports = Round;