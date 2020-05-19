class Hand {

    constructor(suits) {
        this.determined = new Map();
        this.undetermined = { numCards: 4, possibleSuits: suits }
    }
}

module.exports = Hand;