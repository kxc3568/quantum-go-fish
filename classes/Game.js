const Player = require('./Player');

class Game {
    
    constructor(socket, nickname) {
        this.players = [new Player(socket, nickname)];
    }

    addPlayer(socket, nickname) {
        
    }

    removePlayer(nickname) {

    }

    startGame() {

    }
}

module.exports = Game;