const helper = require('../utils');

const maxScore = 10;
const GAME_RESET = '#da70d6';
const FAILED_PUSH = 'black';
const PLAYER_ONE = '#1e00ff';
const PLAYER_TWO = '#ffa500';
let WINNER = null;

const score = {
    [PLAYER_ONE]: 0,
    [PLAYER_TWO]: 0
};

function hasWinner() {
    return Boolean(WINNER);
}

function getWinner() {
    if (score[PLAYER_ONE] >= maxScore) {
        WINNER = true;
        return PLAYER_ONE;
    }
    if (score[PLAYER_TWO] >= maxScore) {
        WINNER = true;
        return PLAYER_TWO;
    }
}

function resetPlayerScore() {
    score[PLAYER_ONE] = 0;
    score[PLAYER_TWO] = 0;
}

function increasePlayerScore(player) {
    score[player]++;
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
    let timeoutId = null;
    const reset = () => {
        update(setPosition(state));
        timeoutId = setTimeout(reset, 500);
    };

    on('down', (pixelIndex) => {
        const { color } = helper.getPixelByIndex(state, pixelIndex);

        if (color === GAME_RESET) {
            WINNER = null;
            resetPlayerScore();
            return helper.returnToMenu(state, update, on);
        }

        if (hasWinner()) {
            return update(state);
        }

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Exit if command not defined, @todo: Use something better
        if (!(color === FAILED_PUSH || color === GAME_RESET || color === PLAYER_ONE || color === PLAYER_TWO)) {
            return;
        }

        increasePlayerScore(color);

        if (getWinner()) {
            update(showWinner(state));
        } else {
            reset();
        }
    });

    resetPlayerScore();
    reset();
};
