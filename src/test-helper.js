/**
 * Test helper
 *
 * @module test-helper
 */
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

/**
 * Game
 *
 * @method
 * @name game
 * @param {State} state The game state
 * @param {number} process Game loop process time in milliseconds
 * @param {Function} exit Method to return to the menu
 * @return {State} The manipulated state object
 */

/**
 * GameRunnerOptions
 *
 * @typedef {Object} GameRunnerOptions
 * @property {State} state A game state object to run the game
 * @property {number} process The game loop process time
 */

/**
 * Run a game with default settings
 *
 * @param {game} game
 * @param {GameRunnerOptions} options
 */
function* runGame(game, { state = getDefaultState(), process = 16 } = {}) {
    let running = true;

    while (running) {
        yield game(state, process, () => {
            running = false;
            return getDefaultState();
        });
    }
}

module.exports = {
    getDefaultState,
    runGame
};
