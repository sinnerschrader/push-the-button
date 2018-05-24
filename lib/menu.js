const fs = require('fs');
const helper = require('./utils');
const gamesDir = './lib/games/';

const FAILED_PUSH = 'black';
let screensaverId = null;
let blinker = null;

/**
 * Game menu
 */
module.exports = function (state, update, on) {
    const showMenu = () => {
        helper.turnOff(state);
        fs.readdir(gamesDir, (err, files) => {
            files.reverse().forEach((file, index) => {
                const [ gameName ] = file.split('.');
                helper.setPixelColorByCoordinates(state, gameName, index, index);
            });
            update(state);
        });
    };
    const activateScreensaver = () => {
        screensaverId = setTimeout(() => {
            const colors = ['red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'white', 'orange'];
            let pos = 1;
            let current_color = 0;
            blinker = setInterval(function() {

                helper.turnOff(state, '#000');
                update(state);

                if (++pos >= state.PIXELS.length) {
                    pos = 0;
                    if (++current_color>= colors.length) {
                        current_color = 0;
                    }
                }
                helper.setPixelColorByIndex(state, colors[current_color], pos);
                update(state);
            }, 200);

            update(state);
        }, 10000);
    };

    on('down', (pixelIndex) => {
        const { color } = helper.getPixelByIndex(state, pixelIndex);

        // Exit if command not defined, @todo: Use something better
        if (color === FAILED_PUSH) {
            return update(state);
        }

        try {
            helper.turnOff(state);
            update(state);
            require(`./games/${color}`)(helper.clone(state), update, on);

            if (screensaverId) {
                clearTimeout(screensaverId);
                clearInterval(blinker);
            }
            return;
        } catch (e) {
            // ignore if module not found
        }

        if (screensaverId) {
            clearTimeout(screensaverId);
            clearInterval(blinker);
            showMenu();
            activateScreensaver();
            return update(state);
        }
    });

    showMenu();

    if (screensaverId) {
        clearTimeout(screensaverId);
    }
    activateScreensaver();
};
