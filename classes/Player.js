const Hand = require('./Hand');

class Player {

    constructor(sid, nickname) {
        this.sid = sid;
        this.nickname = nickname;
        this.hand = null;
    }

    /**
     * Initializes default values of a player's hand
     * @param {String[]} suits 
     */
    initHand(suits) {
        this.hand = new Hand(suits);
    }

    /**
     * Determines one of the player's cards to be the given suit
     * @param {String} suit 
     */
    determine(suit) {

    }

    /**
     * Narrows down the undetermined cards in the player's hand to not be of the
     * given suit
     * @param {String} suit 
     */
    narrow(suit) {

    }
}

module.exports = Player;