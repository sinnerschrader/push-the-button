const helper = require('./utils');

/**
 * This is the actual game
 */
module.exports = function (state, update, on) {
    const mode = {
        WRAK_A_MOLE_1: 'purple',
        WRAK_A_MOLE_2: 'blue',
        SINGLE_PLAYER: 'orange',
        MULTI_PLAYER: 'yellow',
        END: 'orchid'
    };

    on('down', (pixelIndex) => {
        const { color } = helper.getPixelByIndex(state, pixelIndex);

        switch (color) {
            case mode.WRAK_A_MOLE_1:
                state = helper.turnOff(state);
                state = update(state);
                require('./game')(state, update, on);
                break;
            case mode.WRAK_A_MOLE_2:
                state = helper.turnOff(state);
                state = update(state);
                console.log('Game 2');
                break;
            case mode.SINGLE_PLAYER:
                state = helper.turnOff(state);
                state = update(state);
                console.log('Game 2');
                break;
            case mode.MULTI_PLAYER:
                state = helper.turnOff(state);
                state = update(state);
                console.log('Game 2');
        }
    });

    state = helper.setPixelColorByCoordinates(state, mode.WRAK_A_MOLE_1, 0, 0);
    state = helper.setPixelColorByCoordinates(state, mode.WRAK_A_MOLE_2, 1, 1);
    state = helper.setPixelColorByCoordinates(state, mode.SINGLE_PLAYER, 2, 2);
    state = helper.setPixelColorByCoordinates(state, mode.MULTI_PLAYER, 3, 3);

    update(state);
};
