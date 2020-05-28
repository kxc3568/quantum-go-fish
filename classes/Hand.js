class Hand {

    constructor(suits) {
        this.determined = {};
        suits.forEach(suit => this.determined[suit] = 0);
        this.undetermined = [[suits.slice(), 4]];
    }

    /**
     * Determines the identity of one card to be suit
     * @param {String} suit     The suit that the card is determined to be
     */
    determine(suit) {
        for (let i = 0; i < this.undetermined.length; i++) {
            if (this.undetermined[i][0].indexOf(suit) > -1) {
                this.undetermined[i][1] -= 1;
                if (this.undetermined[i][1] === 0) {
                    this.undetermined.splice(i, 1);
                }
                break;
            }
        }
        this.addCard(suit);
    }

    /**
     * Narrows the possible suits of undetermined cards to be not suit
     * @param {String} suit     The suit that the cards are determined not to be
     */
    narrow(suit) {
        const newDetermines = {}
        const keep = Array(this.undetermined.length);
        this.undetermined.forEach((posSuit, undeterminedIndex) => {
            const index = posSuit[0].indexOf(suit);
            if (index > -1) {
                posSuit[0].splice(index, 1);
            }
            if (posSuit[0].length === 1) {
                keep[undeterminedIndex] = false;
                newDetermines[posSuit[0]] = 0;
                for (let i = 0; i < posSuit[1]; i++) {
                    this.addCard(posSuit[0]);
                    newDetermines[posSuit[0]] += 1;
                }
            } else {
                keep[undeterminedIndex] = true;
            }
        });
        this.undetermined = this.undetermined.filter((el, index) => keep[index] === true);
        return newDetermines;
    }

    /**
     * Adds a card of the given suit to the hand
     * @param {String} suit     The suit of the added card
     */
    addCard(suit) {
        if (suit === "") {
            this.undetermined[0][1] += 1;
        } else {
            this.determined[suit] += 1;
        }
    }

    /**
     * Removes a card of the given suit from the hand
     * @param {String} suit     The suit of the lost card
     */
    loseCard(suit) {
        if (suit === "") {
            this.undetermined[0][1] -= 1;
        } else {
            this.determined[suit] -= 1;
        }
    }
}

module.exports = Hand;