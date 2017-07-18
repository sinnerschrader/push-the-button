const helper = require('./utils');

/**
 * This is the actual game
 */
module.exports = function (state, update) {

    const flush = () => {
        for (let i = 0; i < 4; i++) {
            state = helper.setPixelColorByCoordinates(state, 'white', i, i);
            state = helper.setPixelColorByCoordinates(state, 'white', i, i);
            state = helper.setPixelColorByCoordinates(state, 'white', i, i);
            state = helper.setPixelColorByCoordinates(state, 'white', i, i);
        }

        update(state);

        setTimeout(() => a(), 500);
    };

    const b = () => {
        state = helper.setPixelColorByCoordinates(state, 'blue', 0, 1);
        state = helper.setPixelColorByCoordinates(state, 'red', 1, 1);
        state = helper.setPixelColorByCoordinates(state, 'yellow', 2, 1);
        state = helper.setPixelColorByCoordinates(state, 'purple', 3, 1);

        update(state);

        setTimeout(() => flush(), 500);
    };

    const a = () => {
        state = helper.setPixelColorByCoordinates(state, 'yellow', 0, 1);
        state = helper.setPixelColorByCoordinates(state, 'purple', 1, 1);
        state = helper.setPixelColorByCoordinates(state, 'blue', 2, 1);
        state = helper.setPixelColorByCoordinates(state, 'green', 3, 1);

        update(state);

        setTimeout(() => b(), 500);
    };

    a();
};
