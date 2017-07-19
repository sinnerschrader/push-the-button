const helper = require('./utils');

/**
 * This is the actual game
 */
module.exports = function (state, update, on) {

    on('down', (pin) => {
        console.log(pin);
    });

    const flush = () => {
        update(helper.turnOff(state));
        setTimeout(() => a(), 500);
    };

    const b = () => {
        state = helper.setColorHorizontal(state, 'purple', 0);
        update(state);
        setTimeout(() => flush(), 500);
    };

    const a = () => {
        state = helper.setColorHorizontal(state, 'yellow', 0);
        update(state);
        setTimeout(() => b(), 500);
    };

    a();
};
