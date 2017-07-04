const five = require('johnny-five');
const pixel = require('node-pixel');
const setPixelColorByCoordinates = require('./utils').setPixelColorByCoordinates;

const STRIP_PIN = 6;

async function game(config = {}) {
	const board = await createBoard();
	const setup = await getSetup(board, config);
	const state = setPixelColorByCoordinates(setup, 'magenta', 0, 0);
    const strip = await createStrip(board, state.MAX_Y_INDEX + 1);
    getUpdatePredecate(strip)(state);
}

game({
	ORIGIN_PIN: 50,
	MAX_X_PIN: 53,
	MAX_Y_PIN: 53
})
	.catch(err => {
		throw err;
	});

function getUpdatePredecate(strip) {
	console.log(strip);
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

    // prompt user input
	if (!('ORIGIN_PIN' in seed)) {
		strip.pixel(0).color('red');
		strip.show();
		s.ORIGIN_PIN = await getPinPress(board);
        strip.pixel(0).color('green');
        strip.show();
	}

	if (!('MAX_X_PIN' in seed)) {
        s.MAX_X_PIN = await getPinPress(board);
        s.MAX_X_INDEX = s.MAX_X_PIN - s.ORIGIN_PIN;
        strip.pixel(s.MAX_X_INDEX).color('green');
        strip.show();
    }

    s.MAX_X_INDEX = s.MAX_X_PIN - s.ORIGIN_PIN;

    if (!('MAX_Y_PIN' in seed)) {
        s.MAX_Y_PIN = await getPinPress(board);
        s.MAX_Y_INDEX = s.MAX_Y_PIN - s.ORIGIN_PIN;
        strip.pixel(s.MAX_Y_INDEX).color('green');
        strip.show();

        await delay(1000);
    }

    s.MAX_Y_INDEX = s.MAX_Y_PIN - s.ORIGIN_PIN;

	const lineLength = s.MAX_X_INDEX + 1;
	s.PIXELS = range(s.ORIGIN_PIN, s.MAX_Y_INDEX + 1)
		.map((pin, index) => ({
			pin,
			index,
			pressed: false,
			color: '#000',
			x: index % lineLength,
			y: Math.floor(index / lineLength)
		}));

    strip.color('#000');
    strip.show();

	return s;
}

function getPinPress(board) {
	return new Promise(async (resolve, reject) => {
		const maxPin = Object.keys(board.pins).length;

		// Initiate test buttons
		const testButtons = range(0, maxPin)
			.filter(pin => pin !== STRIP_PIN)
			.map(createButtonFromPin);

		// Ignore bogus first down event from all buttons
		setTimeout(() =>{
			testButtons.forEach(testButton => {
				const pin = testButton.pin;

				// Ignore bogus down events for pins 0 and 1
				if (pin === 0 || pin === 1) {
					return;
				}

				function onDown() {
					testButtons.forEach(testButton => testButton.removeAllListeners('down', onDown));
					resolve(pin);
				}

				testButton.on('down', onDown);
			});
		}, 500);
	});
}

function createBoard() {
	return new Promise((resolve, reject) => {
		const board = new five.Board();
		board.on('ready', () => resolve(board));
		board.on('error', reject);
	});
}

function createButtonFromPin(pin) {
	return new five.Button({pin, isPullup: true});
}

function createStrip(board, opts = {}) {
	const {length = Object.keys(board.pins).length} = opts;

	return new Promise((resolve, reject) => {
		const strip = new pixel.Strip({
			board,
			controller: 'FIRMATA',
			data: STRIP_PIN,
			length,
			color_order: pixel.COLOR_ORDER.RGB
		});
		strip.on('ready', () => resolve(strip));
	});
}

function range(start, count) {
	return new Array(count)
		.fill(true)
		.map((_, i) => start + i);
}
