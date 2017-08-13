'use strict';

let gameDuration = 5000;

/**
 * This is the actual game
 */
module.exports = function (state, process, exit) {

    gameDuration -= process;

    if (gameDuration <= 0) {
        return exit();
    }

    return state;
};
