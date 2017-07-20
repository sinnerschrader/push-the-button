const helper = require('./utils');

/**
 * Game menu
 */
module.exports = function (state, update, on) {
    on('down', (pixelIndex) => {
        const { color } = helper.getPixelByIndex(state, pixelIndex);
        try {
            helper.turnOff(state);
            update(state);
            require(`./games/${color}`)(helper.clone(state), update, on);
        } catch (e) {
            // ignore if module not found
        }
    });

    // Games mapping
    helper.setPixelColorByCoordinates(state, 'purple', 0, 0);
    helper.setPixelColorByCoordinates(state, 'blue', 1, 1);
    helper.setPixelColorByCoordinates(state, 'orange', 2, 2);
    helper.setPixelColorByCoordinates(state, 'yellow', 3, 3);

    update(state);
};
