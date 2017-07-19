const helper = require('./utils');

const PLAYER_ONE = 'red';
const PLAYER_TWO = 'green';
const score = {
    [PLAYER_ONE]: 0,
    [PLAYER_TWO]: 0
};

function getRand() {
    return Math.floor(Math.random() * 16);
}

function setPosition(state) {
    const playerAIndex = getRand();
    const playerBIndexTmp = getRand();
    const playerBIndex = playerBIndexTmp === playerAIndex ? getRand() : playerBIndexTmp;

    state = helper.setPixelColorByIndex(state, 'red', playerAIndex);
    state = helper.setPixelColorByIndex(state, 'green', playerBIndex);

    return state;
}

/**
 * This is the actual game
 */
module.exports = function (state, update, on) {
    const maxScore = 2;
    const getWinner = () => {
        if (score[PLAYER_ONE] >= maxScore) {
            return PLAYER_ONE;
        }
        if (score[PLAYER_TWO] >= maxScore) {
            return PLAYER_TWO;
        }
    };
    const blink = (color) => {
        state = helper.turnOff(state);
        state = helper.setPixelColorByCoordinates(state, 'orchid', 3, 3);
        setTimeout(() => {
            state = helper.allOn(state, color);
            state = helper.setPixelColorByCoordinates(state, 'orchid', 3, 3);
            state = update(state);

            setTimeout(() => {
                state = helper.turnOff(state);
                state = helper.setPixelColorByCoordinates(state, 'orchid', 3, 3);
                state = update(state);
                blink(color);
            }, 500);
        }, 500);
    };

    on('down', (pixelIndex) => {
        const { color } = helper.getPixelByIndex(state, pixelIndex);

        if (color === 'orchid') {
            state = helper.turnOff(state);
            score[PLAYER_ONE] = 0;
            score[PLAYER_TWO] = 0;
            return require('./menu')(state, update, on);
        }

        score[color]++;

        const winner = getWinner();
        if (winner) {
            state = helper.allOn(state, color);
            state = helper.setPixelColorByCoordinates(state, 'orchid', 3, 3);
            state = update(state);
            return;
        }
        state = helper.turnOff(state);
        state = update(setPosition(state));
    });

    state = update(setPosition(state));
};
