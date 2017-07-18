const helper = require('./utils');

/**
 * This is the actual game
 */
module.exports = function (state, update) {

    state = helper.setPixelColorByCoordinates(state, 'yellow', 0, 1);
    state = helper.setPixelColorByCoordinates(state, 'yellow', 1, 1);
    state = helper.setPixelColorByCoordinates(state, 'yellow', 2, 1);
    state = helper.setPixelColorByCoordinates(state, 'yellow', 3, 1);

    update(state);
};
