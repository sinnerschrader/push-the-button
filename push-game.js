const five = require('johnny-five');
const pixel = require('node-pixel');

// Assuming this means "digital" in board.pins
const DIGITAL_MODE = 6;
const STRIP_PIN = 6;

const STATE = {
	ORIGIN_PIN: null,
	MAX_X_PIN: null,
	MAX_Y_PIN: null
};

async function game() {
	const board = await createBoard();
	console.log(STATE);
	STATE.ORIGIN_PIN = await getOrigin(board);
	console.log(STATE);
	STATE.MAX_X_PIN = await getPinPress(board);
	console.log(STATE);
	STATE.MAX_Y_PIN = await getPinPress(board);
	console.log(STATE);
}

game()
	.catch(err => {
		throw err;
	});

function getPinPress(board, opts = {}) {
	const {initial = false} = opts;

	return new Promise(async (resolve, reject) => {
		const maxPin = Object.keys(board.pins).length;

		// Initiate test buttons
		const testButtons = range(0, maxPin)
			.filter(pin => pin !== STRIP_PIN)
			.map(createButtonFromPin);

		let initialized = [];

		// Ignore bogus first down event from all buttons
		testButtons.forEach(testButton => {
			testButton.on('down', () => {
				console.log(testButton.pin);
				if (initial === false || initialized.includes(testButton.pin)) {
					return resolve(testButton.pin);
				}
				initialized.push(testButton.pin);
			});
		});

		// Assume all buttons are initialized/do not fire bogus initial down events after one second
		if (initial) {
			setTimeout(() => {
				initialized = testButtons.map(testButton => testButton.pin);
			}, 1000);
		}
	});
}

async function getOrigin(board) {
	const maxPin = Object.keys(board.pins).length;

	// Initiate test strip
	const testStrip = await createStripWithLength(board, maxPin);

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

function createStripWithLength(board, length) {
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