const [ mock ] = process.argv.slice(2);
const { getPixelByIndex } = require('./utils');
const menu = require('./menu');

// The following block loads mock data if cli arg "use-mock" is defined
let Board, Button, Strip, COLOR_ORDER;
if (mock === 'use-mock' || mock === '--use-mock') {
	console.log('Use mock server!');
    ({ Board, Button } = require('./__tests__/mocks/johnny-five'));
    ({ Strip, COLOR_ORDER } = require('./__tests__/mocks/node-pixel'));
} else {
    ({ Board, Button } = require('johnny-five'));
    ({ Strip, COLOR_ORDER } = require('node-pixel'));
}

const STRIP_PIN = 16;
const START_PIN = 22;
const eventRegistry = [];

function on(eventName, callback) {
    eventRegistry.push({ eventName, callback });
}

async function runtime(config = {}) {
    const board = await createBoard();
    const state = await getSetup(board, config);
    const strip = await createStrip(board, state.MAX_Y_INDEX + 1);
    const update = getUpdatePredecate(strip);

    update(state);
    menu(state, update, on);
}

runtime()
    .catch(err => {
        throw err;
    });

function getUpdatePredecate(strip) {
    return function update(state) {
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

async function getSetup(board, seed = {}) {
    const s = Object.assign({}, seed);
    const strip = await createStrip(board);
    const scanRangeLength = 16; // @todo: detect range => (Object.keys(board.pins).length - START_PIN) / 2;

    // Initiate test buttons
    const testButtons = range(START_PIN, scanRangeLength)
        .filter(pin => pin !== STRIP_PIN)
        .map(createButtonFromPin);

    strip.color('#000');

    // prompt user input
    if (!('ORIGIN_PIN' in seed)) {
        strip.pixel(0).color('red');
        strip.show();
        s.ORIGIN_PIN = await getPressFrom(testButtons);
        strip.pixel(0).color('green');
        strip.show();
        console.log(s);
    }

    if (!('MAX_X_PIN' in seed)) {
        s.MAX_X_PIN = await getPressFrom(testButtons);
        s.MAX_X_INDEX = (s.MAX_X_PIN - s.ORIGIN_PIN) / 2;
        strip.pixel(s.MAX_X_INDEX).color('green');
        strip.show();
        console.log(s);
    }

    // @todo: Validate if we can ignore the index assignment
    // s.MAX_X_INDEX = s.MAX_X_PIN - s.ORIGIN_PIN;

    if (!('MAX_Y_PIN' in seed)) {
        s.MAX_Y_PIN = await getPressFrom(testButtons);
        s.MAX_Y_INDEX = (s.MAX_Y_PIN - s.ORIGIN_PIN) / 2;
        strip.pixel(s.MAX_Y_INDEX).color('green');
        strip.show();
        console.log(s);
    }

    // @todo: Validate if we can ignore the index assignment
    // s.MAX_Y_INDEX = s.MAX_Y_PIN - s.ORIGIN_PIN;

    const lineLength = s.MAX_X_INDEX + 1;
    s.PIXELS = range(s.ORIGIN_PIN, s.MAX_Y_INDEX + 1)
        .map((pin, index) => ({
            pin,
            index,
            color: '#000',
            x: (index * 2) % lineLength,
            y: Math.floor((index * 2) / lineLength)
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
            eventRegistry.forEach(({ eventName, callback }) => {
                const pixelIndex = (button.pin - state.ORIGIN_PIN) / 2;
                if (eventName === 'down') {
                    callback(getPixelByIndex(state, pixelIndex).index);
                }
            });
        });
    });
}

function getPressFrom(buttons) {
    return new Promise(async (resolve, reject) => {
        let pressed = false;
        buttons.forEach(button => {
            const onDown = () => {
                if (pressed === false) {
                    console.log('Pressed:', button.pin);
                    resolve(button.pin);
                } else {
                    console.log('Ignored:', button.pin);
                }
                pressed = true;
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
    const {length = Object.keys(board.pins).length} = opts;

    return new Promise((resolve, reject) => {
        const strip = new Strip({
            board,
            controller: 'FIRMATA',
            data: STRIP_PIN,
            length,
            color_order: COLOR_ORDER.RGB
        });
        strip.on('ready', () => resolve(strip));
    });
}

function range(start, count) {
    return new Array(count)
        .fill(0)
        .map((_, i) => start + i * 2);
}
