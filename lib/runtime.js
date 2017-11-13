const path = require('path');
const [ command, pinLength ] = process.argv.slice(2);
const { getPixelByIndex } = require('./utils');
const menu = require('./menu');

const USE_MOCK = command === 'use-mock' || command === '--use-mock';
const BOARD_ID = USE_MOCK ? './__tests__/mocks/johnny-five' : 'johnny-five';
const FIRM_ID = USE_MOCK ? './__tests__/mocks/node-pixel' : 'node-pixel';

const {Board, Button} = require(BOARD_ID);
const {Strip, COLOR_ORDER} = require(FIRM_ID);

const STRIP_PIN = 16;
const START_PIN = 22;

const EVENT_REGISTRY = new Map();

// This test setup is only used to skip that for the now used fixed board
const testSetup = {
    ORIGIN_PIN: 22,
    MAX_X_PIN: 28,
    MAX_X_INDEX: 3,
    MAX_Y_PIN: 52,
    MAX_Y_INDEX: 15
};

function on(eventName, callback) {
    EVENT_REGISTRY.set(eventName, callback);
}

runtime(testSetup)
    .catch(err => {
        console.log(err);
        throw err;
    });

async function runtime(config = {}) {
    // Just a small debug program to test the strip
    if (command === 'debug') {
        return debugStrip(pinLength);
    }

    // Run productive game setup
    const board = await createBoard();
    const strip = await createStrip(board, { length: testSetup.MAX_Y_INDEX + 1 });
    const state = await getSetup(strip, config);
    const update = getUpdatePredecate(strip);

    if (USE_MOCK) {
      const app = require('express')();
      const server = app.listen(4000);
      const io = require('socket.io')(server);
      const { renderPixels } = require('./__tests__/mocks/utils');

      board.io = io;

      io.on('connection', socket => {
        socket.on('click', data => {
          const cb = EVENT_REGISTRY.get('down');
          cb(data.id);
        });
      });

      app.use('/static', require('express').static(path.join(__dirname, `./__tests__/mocks/public`)));
      app.use('/', renderPixels(state.PIXELS));
    }

    update(state);
    menu(state, update, on);
}

async function debugStrip(pinLength) {
    console.log('Use strip debug program!');
    const length = parseInt(pinLength, 10);

    if (isNaN(length)) {
        throw new Error('Invalid pin length given!');
    }

    const board = await createBoard();
    const strip = await createStrip(board, { length });
    strip.color('yellow');
    strip.show();
}

function getUpdatePredecate(strip) {
    let prev = null;
    return function update(state) {
        // Prevent unnecessary state changes
        if (prev === JSON.stringify(state)) {
            return state;
        }
        prev = JSON.stringify(state);

        // Update state
        strip.clear();
        strip.pixel(0).color('#000'); // @todo: Hacky hack to reset first strip
        state.PIXELS.forEach(pixel => {
            strip.pixel(pixel.index).color(pixel.color);
        });
        strip.show();
        return state;
    }
}

async function delay(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration)
    });
}

async function getSetup(strip, seed = {}) {
    const s = Object.assign({}, seed);
    const scanRangeLength = 16; // @todo: detect range => (Object.keys(board.pins).length - START_PIN) / 2;

    // Initiate test buttons
    const testButtons = range(s.ORIGIN_PIN, scanRangeLength)
        .filter(pin => pin !== STRIP_PIN)
        .map(createButtonFromPin);

    strip.color('#000');

    const lineLength = s.MAX_X_INDEX + 1;

    s.PIXELS = range(s.ORIGIN_PIN, s.MAX_Y_INDEX + 1)
        .map((pin, index) => ({
            pin,
            index,
            color: '#000',
            x: index % lineLength,
            y: Math.floor(index / lineLength)
        }));

    await delay(1000);
    strip.color('#000');
    strip.show();

    registerButtonEvents(s, testButtons);

    return s;
}

function registerButtonEvents(state, buttons) {
    buttons.forEach((button) => {
        button.on('down', () => {
            const callback = EVENT_REGISTRY.get('down');
            const pixelIndex = (button.pin - state.ORIGIN_PIN) / 2;
            callback(getPixelByIndex(state, pixelIndex).index);
        });
    });
}

function getPressFrom(buttons) {
    return new Promise(async (resolve, reject) => {
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

function createBoard() {
    return new Promise((resolve, reject) => {
        const board = new Board();
        board.on('ready', async () => {
            // Hacky hack to ignore the first ghost call
            await delay(0);
            resolve(board);
        });
        board.on('error', reject);
    });
}

function createButtonFromPin(pin) {
  return new Button({pin, isPulldown: true});
}

function createStrip(board, opts = {}) {
    const {length} = opts;

    return new Promise((resolve, reject) => {
        const strip = new Strip({
            board,
            controller: 'FIRMATA',
            data: STRIP_PIN,
            length,
            color_order: COLOR_ORDER.RGB
        });
        strip.on('ready', () => resolve(strip));
        strip.on('error', reject);
    });
}

function range(start, count) {
    return new Array(count)
        .fill(0)
        .map((_, i) => start + i * 2);
}
