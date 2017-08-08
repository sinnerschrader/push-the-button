const fs = require('fs');
const path = require('path');
const utils = require('./utils');

const gamesPath = path.resolve(__dirname, '..', 'games');

const games = fs.readdirSync(gamesPath).map(file => ({
    color: path.basename(file, path.extname(file)),
    fn: require(path.join(gamesPath, file))
}));

// @todo: PLEASE REFACTOR ME!!!!

const EXIT_DURATION = 3000;
let exitHoldDuration = EXIT_DURATION;
let selectedGame = null;

/**
 * Game menu
 */
module.exports = function (state, process) {
    const [ firstBtn, lastBtn ] = state.filter(p => p.pressed);

    if (exitHoldDuration <= 0) {
        selectedGame = null;
        if (!state.some(p => p.pressed)) {
            exitHoldDuration = EXIT_DURATION;
        }
        state = state.map(pixel => {
            pixel.color = utils.COLOR.DEFAULT;
            return pixel;
        });
        games.forEach((game, index) => state[index * 5].color = game.color);
        return state;
    }

    // Check if exit button are hold for x seconds
    if (selectedGame && state[0] === firstBtn && state[state.length - 1] === lastBtn) {
        exitHoldDuration -= process;
    } else {
        exitHoldDuration = EXIT_DURATION;
    }

    if (selectedGame) {
        state = state.map(pixel => {
            pixel.color = utils.COLOR.DEFAULT;
            return pixel;
        });

        return selectedGame.fn(state, process, () => {
            selectedGame = null;
            state = state.map(pixel => {
                pixel.color = utils.COLOR.DEFAULT;
                return pixel;
            });
            games.forEach((game, index) => state[index * 5].color = game.color);
            return state;
        });
    }

    const pressed = state.find(p => p.pressed);
    selectedGame = pressed && games.find(g => pressed.color === g.color);

    // / Show menu
    games.forEach((game, index) => state[index * 5].color = game.color);
    return state;
};
