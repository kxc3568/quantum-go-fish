class Round {

    constructor(players, settings) {
        this.players = players;
        this.turn = Math.floor(Math.random() * players.length);
        this.history = [];
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
     * Gets player with the given nickname
     */
    getPlayer(name) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].nickname === name) {
                return this.players[i];
            }
        }
    }

    /**
     * Retrieves the last action performed from history
     */
    getLastAction() {
        return this.history[this.history.length-1];
    }

    /**
     * Retrieves the player who's turn it is
     */
    getTurnPlayer() {
        return this.players[this.turn];
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
     * @param {String} playerFromString     The name of the player that asked the question
     * @param {String} suit                 The suit that is being asked
     */
    ask(playerFromString, playerToString, suit) {
        const playerFrom = this.getPlayer(playerFromString);
        const playerFromHand = playerFrom.getHand();
        if (playerFromHand.determined[suit] === 0) {
            playerFrom.determine(suit);
        }
        this.history.push({ type: "Question", from: playerFromString, to: playerToString, suit: suit })
    }

    /**
     * Determines or narrows values of playerTo's hand based on playerTo's response
     * to playerFrom's question. Processes transferring of cards between players.
     * @param {String} playerFromString     The name of the player that asked the question
     * @param {String} playerToString       The name of the player that was asked the question
     * @param {String} res                  Whether the player has the card or not
     * @param {String} suit                 The suit that is being asked
     */
    respond(playerFrom, playerToString, res, suit) {
        const playerTo = this.getPlayer(playerToString);
        if (res === "Yes") {
            const playerToHand = playerTo.getHand();
            if (playerToHand.determined[suit] === 0) {
                playerTo.determine(suit);
            }
            playerTo.transferCard(playerFrom, suit);
        } else {
            playerTo.narrow(suit);
        }
        this.history.push({ type: "Response", from: playerToString, to: playerFrom.nickname, suit: suit })
    }
}

module.exports = Round;