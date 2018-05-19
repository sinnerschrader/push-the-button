/**
 * Menu
 *
 * The game menu to show and enter games.
 *
 * @module lib/menu
 */
'use strict';

const fs = require('fs');
const path = require('path');
const utils = require('./utils');

const gamesPath = path.resolve(__dirname, '..', 'games');
const isNoDirectory = file => !fs.statSync(path.resolve(gamesPath, file)).isDirectory();

const games = fs.readdirSync(gamesPath).filter(isNoDirectory).map(file => ({
    color: path.basename(file, path.extname(file)),
    fn: require(path.join(gamesPath, file))
}));

const screensaver = {
    color: 'black',
    fn: require('./screensaver.js')
}

const EXIT_DURATION = 3000;
let exitHoldDuration = EXIT_DURATION;
let selectedGame = null;

let idleTimeout;
const IDLE_DURATION = 10000;

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

    if(!idleTimeout){
        idleTimeout = setTimeout( () => selectedGame = screensaver,IDLE_DURATION);
    }

    console.log(!!idleTimeout, selectedGame);

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
    if(pressed){
        clearTimeout(idleTimeout);
        idleTimeout = undefined;
    }
    selectedGame = pressed && games.find(game => pressed.color === game.color);

    return showGames(state, games);
};
