const helper = require('../utils');

const PLAYER_ONE = 'red';
const PLAYER_TWO = 'green';
const score = {
    [PLAYER_ONE]: 0,
    [PLAYER_TWO]: 0
};

/**
 * This is the actual game
 */
module.exports = function (state, update, on) {
    const maxScore = 2;
    const setPosition = () => {
        const playerAIndex = helper.getRandomIndex(state);
        const playerBIndexTmp = helper.getRandomIndex(state);
        const playerBIndex = playerBIndexTmp === playerAIndex ? helper.getRandomIndex(state) : playerBIndexTmp;

        helper.setPixelColorByIndex(state, 'red', playerAIndex);
        helper.setPixelColorByIndex(state, 'green', playerBIndex);
    };
    const getWinner = () => {
        if (score[PLAYER_ONE] >= maxScore) {
            return PLAYER_ONE;
        }
        if (score[PLAYER_TWO] >= maxScore) {
            return PLAYER_TWO;
        }
    };
    const blink = (color) => {
        helper.turnOff(state);
        helper.setPixelColorByCoordinates(state, 'orchid', 3, 3);
        setTimeout(() => {
            helper.allOn(state, color);
            helper.setPixelColorByCoordinates(state, 'orchid', 3, 3);
            update(state);

            setTimeout(() => {
                helper.turnOff(state);
                helper.setPixelColorByCoordinates(state, 'orchid', 3, 3);
                update(state);
                blink(color);
            }, 500);
        }, 500);
    };

    on('down', (pixelIndex) => {
        const { color } = helper.getPixelByIndex(state, pixelIndex);

        if (color === 'orchid') {
            helper.turnOff(state);
            score[PLAYER_ONE] = 0;
            score[PLAYER_TWO] = 0;
            return require('../menu')(helper.clone(state), update, on);
        }

        score[color]++;

        const winner = getWinner();
        if (winner) {
            helper.allOn(state, color);
            helper.setPixelColorByCoordinates(state, 'orchid', 3, 3);
            update(state);
            return;
        }
        helper.turnOff(state);
        setPosition(state);
        update(state);
    });

    setPosition(state);
    update(state);
};
