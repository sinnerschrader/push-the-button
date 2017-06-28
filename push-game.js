const five = require('johnny-five');
const pixel = require('node-pixel');

// Assuming this means "digital" in board.pins
const DIGITAL_MODE = 6;
const STRIP_PIN = 6;

const setup = {
	ORIGIN_PIN: null,
	MAX_X_PIN: null,
	MAX_Y_PIN: null
};

async function game(config = {}) {
	const setup = config.setup || await getSetup();
}

game()
	.catch(err => {
		throw err;
	});

async function getSetup() {
	const s = {};

	const board = await createBoard();
	s.ORIGIN_PIN = await getOrigin(board);

	const strip = await createStrip(board);

	strip.pixel(0).color('green');
	strip.show();

	s.MAX_X_PIN = await getPinPress(board);
	strip.pixel(1).color('green');
	strip.show();

	s.MAX_Y_PIN = await getPinPress(board);
	strip.pixel(2).color('green');
	strip.show();

	strip.color('green');
	strip.show();

	return s;
}

function getPinPress(board, opts = {}) {
	const {initial = false} = opts;

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

async function getOrigin(board) {
	// Initiate test strip
	const testStrip = await createStrip(board);

	// prompt user input
	testStrip.pixel(0).color('red');
	testStrip.show();

	// Wait for user to press the correct button
	return getPinPress(board, {initial: true});
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