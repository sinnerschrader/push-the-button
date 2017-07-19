const helper = require('./utils');

/**
 * This is the actual game
 */
module.exports = function (state, update, on) {

    on('down', (pixelIndex) => {
        console.log(helper.getPixelByIndex(state, pixelIndex));
    });

    const flush = () => {
        update(helper.turnOff(state));
        setTimeout(() => a(), 500);
    };

    const b = () => {
        state = helper.setColorHorizontal(state, ['purple', 'red', 'green', 'blue'], 0);
        update(state);
        setTimeout(() => flush(), 500);
    };

    const a = () => {
        state = helper.setColorHorizontal(state, ['yellow', 'green', 'blue', 'purple'], 0);
        update(state);
        setTimeout(() => b(), 500);
    };

    a();
};
