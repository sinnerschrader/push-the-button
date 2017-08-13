'use strict';

const fs = require('fs');
const path = require('path');
const utils = require('./utils');

const gamesPath = path.resolve(__dirname, '..', 'games');

const games = fs.readdirSync(gamesPath).map(file => ({
    color: path.basename(file, path.extname(file)),
    fn: require(path.join(gamesPath, file))
}));

const EXIT_DURATION = 3000;
let exitHoldDuration = EXIT_DURATION;
let selectedGame = null;

/**
 * Show the available games
 *
 * @param {State} state
 * @param {string[]} games
 * @return {State}
 */
const showGames = (state, games) => {
    state = utils.resetState(state);
    games.forEach((game, index) => state[index * 5].color = game.color);
    return state;
};

/**
 * Game menu
 */
module.exports = function (state, process) {
    const [ firstBtn, lastBtn ] = state.filter(pixel => pixel.pressed);

    if (exitHoldDuration <= 0) {
        selectedGame = null;

        if (!state.some(pixel => pixel.pressed)) {
            exitHoldDuration = EXIT_DURATION;
        }

        return showGames(state, games);
    }

    // Check if exit button are hold for x seconds
    if (selectedGame && state[0] === firstBtn && state[state.length - 1] === lastBtn) {
        exitHoldDuration -= process;
    } else {
        exitHoldDuration = EXIT_DURATION;
    }

    if (selectedGame) {
        state = utils.resetState(state);
        return selectedGame.fn(state, process, () => {
            selectedGame = null;
            return showGames(state, games);
        });
    }

    const pressed = state.find(pixel=> pixel.pressed);
    selectedGame = pressed && games.find(game => pressed.color === game.color);

    return showGames(state, games);
};
