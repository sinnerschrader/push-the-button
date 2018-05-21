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
const color_utils = require('./color_utils');

const gamesPath = path.resolve(__dirname, '..', 'games');
const isNoDirectory = file => !fs.statSync(path.resolve(gamesPath, file)).isDirectory();

const games = fs.readdirSync(gamesPath).filter(isNoDirectory).map(file => ({
    color: path.basename(file, path.extname(file)),
    fn: require(path.join(gamesPath, file))
}));

const screensaver = {
    color: 'black',
    fn: require('./screensaver')
}

const EXIT_DURATION = 3000;
let exitHoldDuration = EXIT_DURATION;
let selectedGame = null;

let idleTimeout;
const IDLE_DURATION = 10000;

const INTRO_DURATION = 100;
let introDuration = INTRO_DURATION;

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

const showIntro = (state, time) => {
    let color = 0;
    if(time > INTRO_DURATION/2){
        color = (INTRO_DURATION-time)*3;
    } else {
        color = time*3;
    }
    console.log(color, time, INTRO_DURATION/2);

    state.forEach(element => {
        element.color = color_utils.rgbArray2hex([color,color,color]);
    });
    return state
}

/**
 * Game menu
 */
module.exports = function (state, process) {
    introDuration--;
    if (introDuration > 0) {
        return showIntro(state, introDuration);
    }

    const [ firstBtn, lastBtn ] = state.filter(pixel => pixel.pressed);


    if(!idleTimeout){
        idleTimeout = setTimeout( () => selectedGame = screensaver,IDLE_DURATION);
    }

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
            introDuration = INTRO_DURATION;
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
