const Hand = require('./Hand');

class Player {

    constructor(sid, nickname) {
        this.sid = sid;
        this.nickname = nickname;
        this.hand = null;
    }

    /**
     * Initializes default values of a player's hand
     * @param {String[]} suits  A list of suits in the game
     */
    initHand(suits) {
        this.hand = new Hand(suits);
    }

    /**
     * Retrieves the player's hand
     */
    getHand() {
        return this.hand;
    }

    /**
     * Determines one of the player's cards to be the given suit
     * @param {String} suit     The suit that the card is determined to be
     */
    determine(suit) {
        this.getHand().determine(suit);
    }

    /**
     * Narrows down the undetermined cards in the player's hand to not be of the
     * given suit
     * @param {String} suit     The suit that the cards are determined not to be
     */
    narrow(suit) {
        this.getHand().narrow(suit);
    }

    /**
     * Transfers a card of the given suit from one player to another
     * @param {Player} player   The player to transfer the card to
     * @param {String} suit     The suit of the card being transferred
     */
    transferCard(player, suit) {
        this.getHand().loseCard(suit);
        player.getHand().addCard(suit);
    }
}

module.exports = Player;