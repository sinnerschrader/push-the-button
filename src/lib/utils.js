const { Board, Button } = require('johnny-five');
const { Strip, COLOR_ORDER } = require('node-pixel');

/**
 * Create an board compatible empty array with x number values
 *
 * @param {number} start Start count to fill
 * @param {number} count How many entries to add
 * @return {Array} Array filled with number values
 */
function range(start, count) {
    return new Array(count)
        .fill(undefined)
        .map((_, i) => start + i * 2);
}

/**
 * Delay execution
 *
 * @param {number} duration Time to delay in milliseconds
 * @return {Promise}
 */
async function delay(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}

const COLOR = Object.freeze({
    DEFAULT: '#000',
    RED: 'red',
    GREEN: 'green'
});

/**
 * Board
 *
 * @typedef {Object} Board
 */

/**
 * Board options
 *
 * @typedef {Object} BoardOptions
 * @property {?string} id User definable identification
 * @property {?string} port eg. /dev/ttyAM0, COM1, new SerialPort(). Path or name of device port/COM or SerialPort object
 * @property {?boolean} repl Set to false to disable REPL
 * @property {?boolean} debug Set to false to disable debugging output
 * @property {?number} timeout Timeout in seconds for the board to get connected
 */

/**
 * Create a new board instance
 *
 * @param {?BoardOptions} options Board options
 * @return {Promise}
 * @resolves {Board} The board instance
 * @rejects {Error} An error
 */
function createBoard(options = {}) {
    return new Promise((resolve, reject) => {
        const board = new Board(options);
        board.on('ready', async () => resolve(board));
        board.on('error', reject);
    });
}

/**
 * Strip
 *
 * @typedef {Object} Strip
 */

/**
 * Color order
 *
 * @typedef {Object} ColorOrder
 * @readonly
 * @enum {number}
 */

/**
 * Strip options
 *
 * @typedef {Object} StripOptions
 * @property {number} length The strip length, amount of pixels
 * @property {number} pin The pin where the strip is mounted
 * @property {?string} controller Controller type
 * @property {?number} data Pin where the strip is mounted
 * @property {?ColorOrder} colorOrder The strip color order
 * @property {?{ pin: number, length: number }[]} strips Define multiple strips
 */

/**
 * Create a pixel strip
 *
 * @param {Board} board A board instance
 * @param {StripOptions} options Strip options
 * @return {Promise}
 * @resolves {Strip} A strip instance
 * @rejects {Error} An error
 */
function createStrip(board, options = {}) {
    const {
        length,
        pin,
        controller = 'FIRMATA',
        colorOrder = COLOR_ORDER.RGB,
    } = options;

    return new Promise((resolve, reject) => {
        const strip = new Strip({
            board,
            controller,
            data: pin,
            length,
            color_order: colorOrder
        });
        strip.on('ready', () => resolve(strip));
        strip.on('error', reject);
    });
}

/**
 * Button
 *
 * @typedef {Object} Button
 * @property {Function} on Event handler
 * @property {Function} removeListener Remove event handler
 */

/**
 * Get a press from board
 *
 * @param {Button[]} buttons Array of button instances
 * @return {Promise}
 * @resolves {number} The pin pressed
 */
function getPressFrom(buttons) {
    return new Promise(async (resolve) => {
        let pressed = false;
        buttons.forEach(button => {
            const onDown = () => {
                if (pressed === false) {
                    resolve(button.pin);
                }
                pressed = true;
                button.removeListener('down', onDown);
            };
            button.on('down', onDown);
        });
    });
}

/**
 * Create a new button
 *
 * @param {number} pin The pin slot
 * @return {Button} Button instance
 */
function createButtonFromPin(pin) {
    return new Button({ pin, isPulldown: true });
}

/**
 * Pixel
 *
 * @typedef {Object} Pixel
 * @property {number} x X position of pixel
 * @property {number} y Y position of pixel
 * @property {boolean} pressed Pixel pressed state
 * @property {string} color Color value of the pixel
 */

/**
 * State
 *
 * @typedef {Pixel[]} State
 */

/**
 * RuntimeDescriptor
 *
 * @typedef {Object} RuntimeDescriptor
 * @property {?number} startPin Board start pin
 * @property {?number} stripPin Board strip pin
 * @property {?number} originPin Strip origin pin
 * @property {?number} maxXPin Max strip x pin
 * @property {?number} maxXIndex Strip x index
 * @property {?number} maxYPin Max strip y pin
 * @property {?number} maxYIndex Strip y index
 * @property {?Board} board Created board instance
 * @property {?Strip} strip Created strip instance
 * @property {?Button[]} buttons Buttons created to capture setup
 * @property {?State} state The current board state
 */

/**
 * Make the board setup process happen
 *
 * @todo: Setup still don't work! Needs a way to read defined pins only.
 * @param {Board} board A board instance
 * @param {Strip} strip A strip instance
 * @param {?RuntimeDescriptor} descriptor A runtime representation
 * @return {RuntimeDescriptor} The fully configured runtime representation
 */
async function getSetup(board, strip, descriptor = {}) {
    descriptor = Object.assign({ startPin: 22, stripPin: 16 }, descriptor);

    // Initiate test buttons
    const testButtons = range(descriptor.startPin, strip.length)
        .filter(pin => pin !== descriptor.stripPin)
        .map(createButtonFromPin);

    strip.color(COLOR.DEFAULT);

    // prompt user input
    if (!('originPin' in descriptor)) {
        strip.pixel(0).color(COLOR.RED);
        strip.show();
        descriptor.originPin = await getPressFrom(testButtons);
        strip.pixel(0).color(COLOR.GREEN);
        strip.show();
    }

    if (!('maxXPin' in descriptor)) {
        descriptor.maxXPin = await getPressFrom(testButtons);
        descriptor.maxXIndex = (descriptor.maxXPin - descriptor.originPin) / 2;
        strip.pixel(descriptor.maxXIndex).color(COLOR.GREEN);
        strip.show();
    }

    if (!('maxYPin' in descriptor)) {
        descriptor.maxYPin = await getPressFrom(testButtons);
        descriptor.maxYIndex = (descriptor.maxYPin - descriptor.originPin) / 2;
        strip.pixel(descriptor.maxYIndex).color(COLOR.GREEN);
        strip.show();
    }

    const lineLength = descriptor.maxXIndex + 1;
    descriptor.state = range(descriptor.originPin, descriptor.maxYIndex + 1)
        .map((pin, index) => ({
            x: index % lineLength,
            y: Math.floor(index / lineLength),
            pressed: false,
            color: COLOR.DEFAULT
        }));

    descriptor.board = board;
    descriptor.strip = strip;
    descriptor.buttons = testButtons;

    await delay(1000);
    strip.color(COLOR.DEFAULT);
    strip.show();

    return descriptor;
}

/**
 * Create a runtime representation object by running the setup program
 *
 * @param {RuntimeDescriptor} descriptor
 * @return {RuntimeDescriptor}
 */
async function getRuntimeDescriptor(descriptor = {}) {
    const { length = 16, pin = 16 } = descriptor;
    const board = await createBoard();
    const strip = await createStrip(board, {length, pin});

    return await getSetup(board, strip, descriptor);
}

/**
 * Check if state should update
 *
 * @param {State} currentState
 * @param {State} nextState
 * @return {boolean}
 */
function stateShouldUpdate(currentState, nextState) {
    return JSON.stringify(currentState) !== JSON.stringify(nextState);
}

/**
 * Copy an object
 *
 * @param {Object} obj
 * @return {Object}
 */
function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Clone a simple object
 *
 * @param {State} state State object
 * @param {number[]} eventState Button press event state
 * @return {State} Prepared and freezed state
 */
function prepareState(state, eventState) {
    return state.reduce((nextState, pixel, index) => {
        pixel.pressed = eventState[index];
        return [
            ...nextState,
            pixel
        ];
    }, []);
}

/**
 * Animation frame
 *
 * @param {Function} callback Function to call
 * @return {number} Animation frame id for cancellation
 */
const xRequestAnimationFrame = (() => {
    let lastTime = 0;
    return (callback) => {
        const currTime = Date.now();
        const timeToCall = Math.max(0, 16 - (currTime - lastTime)); // 16ms/frame
        const id = setTimeout(() => callback(currTime + timeToCall), timeToCall);

        lastTime = currTime + timeToCall;

        return id;
    };
})();

/**
 * Cancel a given animation frame
 *
 * @param {number} id Animation frame id
 */
const xCancelAnimationFrame = (id) => clearTimeout(id);

module.exports = {
    range,
    delay,
    COLOR,
    createBoard,
    createStrip,
    getSetup,
    getRuntimeDescriptor,
    copy,
    stateShouldUpdate,
    prepareState,
    xRequestAnimationFrame,
    xCancelAnimationFrame
};
