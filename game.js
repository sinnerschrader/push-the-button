const helper = require('./utils');

/**
 * This is the actual game
 */
module.exports = function (state, update, on) {

    let line = 0;

    on('down', (pixelIndex) => {
        console.log(helper.getPixelByIndex(state, pixelIndex));
    });

    const flush = () => {
        state = update(helper.turnOff(state));

        line++;
        if (line === 4) {
            line = 0;
        }

        setTimeout(() => a(), 500);
    };

    const b = () => {
        state = helper.setColorHorizontal(state, ['purple', 'red', 'green', 'blue'], line);
        state = update(state);
        setTimeout(() => flush(), 500);
    };

    const a = () => {
        state = helper.setColorHorizontal(state, ['yellow', 'green', 'blue', 'purple'], line);
        state = update(state);
        setTimeout(() => b(), 500);
    };

    a();
};
