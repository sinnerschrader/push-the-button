const helper = require('../utils');

const maxScore = 2;
const GAME_RESET = '#da70d6';
const PLAYER_ONE = '#d80c0c';
const PLAYER_TWO = '#ffa500';
const score = {
    [PLAYER_ONE]: 0,
    [PLAYER_TWO]: 0
};

function getWinner() {
    if (score[PLAYER_ONE] >= maxScore) {
        return PLAYER_ONE;
    }
    if (score[PLAYER_TWO] >= maxScore) {
        return PLAYER_TWO;
    }
}

function resetPlayerScore() {
    score[PLAYER_ONE] = 0;
    score[PLAYER_TWO] = 0;
}

function setPosition(state) {
    const playerOneIndex = helper.getRandomIndex(state);
    const playerTwoIndexTmp = helper.getRandomIndex(state);
    const playerTwoIndex = playerTwoIndexTmp === playerOneIndex ? helper.getRandomIndex(state) : playerTwoIndexTmp;

    helper.turnOff(state);
    helper.setPixelColorByIndex(state, PLAYER_ONE, playerOneIndex);
    helper.setPixelColorByIndex(state, PLAYER_TWO, playerTwoIndex);

    return state;
}

function showWinner(state) {
    helper.allOn(state, getWinner());
    resetPlayerScore();
    helper.setPixelColorByCoordinates(state, GAME_RESET, 3, 3);
    return state;
}

/**
 * This is the actual game
 */
module.exports = function (state, update, on) {
    on('down', (pixelIndex) => {
        const { color } = helper.getPixelByIndex(state, pixelIndex);

        if (color === GAME_RESET) {
            return helper.returnToMenu(state, update, on);
        }

        score[color]++;

        if (getWinner()) {
            update(showWinner(state));
            return;
        }

        update(setPosition(state));
    });

    update(setPosition(state));
};
