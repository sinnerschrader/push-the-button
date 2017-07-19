/**
 * The game state object
 *
 * @typedef {Object} State
 * @property {number} ORIGIN_PIN
 * @property {number} MAX_X_PIN
 * @property {number} MAX_X_INDEX
 * @property {number} MAX_Y_PIN
 * @property {number} MAX_Y_INDEX
 * @property {Pixel[]} PIXELS
 */

/**
 * The pixel object
 *
 * @typedef {Object} Pixel
 * @property {number} pin
 * @property {number} index
 * @property {boolean} pressed
 * @property {string} color
 * @property {number} x
 * @property {number} y
 */

/** @type {State} */
const testData = {
    ORIGIN_PIN: 50,
    MAX_X_PIN: 53,
    MAX_X_INDEX: 3,
    MAX_Y_PIN: 53,
    MAX_Y_INDEX: 3,
    PIXELS: [
        {
            pin: 50,
            index: 0,
            pressed: false,
            color: '#000',
            x: 0,
            y: 0
        },
        {
            pin: 51,
            index: 1,
            pressed: false,
            color: '#000',
            x: 1,
            y: 0
        },
        {
            pin: 52,
            index: 2,
            pressed: false,
            color: '#000',
            x: 2,
            y: 0
        },
        {
            pin: 53,
            index: 3,
            pressed: false,
            color: '#000',
            x: 3,
            y: 0
        },
        {
            pin: 54,
            index: 4,
            pressed: false,
            color: '#000',
            x: 0,
            y: 1
        }
    ]
};

/** @param {Object} obj */
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/** @param {State} state */
function getPixels(state) {
    return clone(state.PIXELS);
}

/**
 * @param {State} state
 * @param {number} index
 * @return {State}
 */
function getPixelByIndex(state, index) {
    return clone(getPixels(state)[index]);
}

/**
 * @param {State} state
 * @return {number}
 */
function getLineLength(state) {
    return state.MAX_X_INDEX + 1;
}

/**
 * @param {State} state
 * @param {number} x
 * @param {number} y
 * @return {Pixel}
 */
function getPixelByCoordinates(state, x, y) {
    return clone(getPixelByIndex(state, getPixelIndexFromCoordinates(state, x, y)));
}

/**
 * @param {State} state
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
function getPixelIndexFromCoordinates(state, x, y) {
    return getLineLength(state) * y + x;
}

/**
 * @param {State} state
 * @param {Pixel} pixel
 * @param {number} x
 * @param {number} y
 * @return {State}
 */
function setPixelByCoordinates(state, pixel, x, y) {
    const clonedState = clone(state);
    clonedState.PIXELS[getPixelIndexFromCoordinates(state, x, y)] = pixel;
    return clonedState;
}

/**
 * @param {State} state
 * @param {string} color
 * @param {number} x
 * @param {number} y
 * @return {State}
 */
function setPixelColorByCoordinates(state, color, x, y) {
    const pixel = getPixelByCoordinates(state, x, y);
    pixel.color = color;
    return setPixelByCoordinates(state, pixel, x, y);
}

/**
 * @param {State} state
 * @param {string} color
 * @return {State}
 */
function setColorAll(state, color) {
    const lineLength = getLineLength(state);
    for (let i = 0; i < lineLength; i++) {
        state = setPixelColorByCoordinates(state, color, 0, i);
        state = setPixelColorByCoordinates(state, color, 1, i);
        state = setPixelColorByCoordinates(state, color, 2, i);
        state = setPixelColorByCoordinates(state, color, 3, i);
    }

    return state;
}

/**
 * @param {State} state
 * @param {?string} color
 * @return {State}
 */
function turnOff(state, color = 'black') {
    return setColorAll(state, color);
}

/**
 * @param {State} state
 * @param {?string} color
 * @return {State}
 */
function allOn(state, color = 'white') {
    return setColorAll(state, color);
}

module.exports = {
    testData,
    getPixels,
    getPixelByIndex,
    getLineLength,
    getPixelByCoordinates,
    getPixelIndexFromCoordinates,
    setPixelByCoordinates,
    setPixelColorByCoordinates,
    turnOff,
    allOn
};
