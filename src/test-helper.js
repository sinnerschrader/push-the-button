'use strict';

const { COLOR } = require('./lib/utils');

/**
 * Get a dummy state object
 *
 * @param {number} length How many pixel should be added
 * @param {number} size The board max x/y size
 * @return {State}
 */
function getDefaultState(length = 16, size = 4) {
    let y = -1;
    return Array(length).fill({}).map((_, i) => {
        y = i % size === 0 ? ++y : y;
        return { x: i % size, y, pressed: false, color: COLOR.DEFAULT };
    });
}

module.exports = {
    getDefaultState
};
