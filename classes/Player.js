const Hand = require('./Hand');

class Player {

    constructor(sid, nickname) {
        this.sid = sid;
        this.nickname = nickname;
        this.hand = null;
        this.shownHand = null;
        this.score = 0;
    }

    /**
     * Initializes default values of a player's hand
     * @param {String[]} suits  A list of suits in the game
     */
    initHand(suits) {
        this.hand = new Hand(suits);
        this.shownHand = new Hand(suits);
    }

    /**
     * Retrieves the player's hand
     */
    getHand() {
        return this.hand;
    }

    /**
     * Retrieves the player's hand as all undetermined
     */
    getShownHand() {
        return this.shownHand;
    }

    /**
     * Increments the player's score because they won the game
     */
    win() {
        this.score += 3;
    }

    /**
     * Decrements the player's score because they made a move that was illegal
     */
    madeIllegalMove() {
        this.score -= 1;
    }

    /**
     * Determines one of the player's cards to be the given suit
     * @param {String} suit     The suit that the card is determined to be
     */
    determine(suit) {
        this.hand.determine(suit);
    }

    /**
     * Narrows down the undetermined cards in the player's hand to not be of the
     * given suit
     * @param {String} suit     The suit that the cards are determined not to be
     */
    narrow(suit) {
        return this.hand.narrow(suit);
    }

    /**
     * Transfers a card of the given suit from one player to another
     * @param {Player} player   The player to transfer the card to
     * @param {String} suit     The suit of the card being transferred
     */
    transferCard(player, suit) {
        this.shownHand.loseCard("");
        this.hand.loseCard(suit);
        player.getHand().addCard(suit);
        player.getShownHand().addCard("");
    }
}

module.exports = Player;