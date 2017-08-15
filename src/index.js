const {
    getRuntimeDescriptor,
    applyStates,
    copy,
    stateShouldUpdate,
    xRequestAnimationFrame
} = require('./lib/utils');
const menu = require('./lib/menu');

/**
 * Register events
 *
 * @param {RuntimeDescriptor} descriptor
 * @return {boolean[]}
 */
function getEventState({ buttons }) {
    const buttonState = Array(buttons.length).fill(false);

    buttons.forEach((button, index) => {
        button.on('down', () => buttonState[index] = true);
        button.on('up', () => buttonState[index] = false);
    });

    return buttonState;
}

/**
 * Update the state by a game or menu
 *
 * @param {State} state The current state
 * @param {number} progress Game loop progress
 * @return {State} The next state
 */
function update(state, progress) {
    return menu(state, progress);
}

/**
 * Draw current state to board
 *
 * @param {RuntimeDescriptor} descriptor
 */
function draw({ strip, state }) {
    state.forEach(({ color }, index) => strip.pixel(index).color(color));
    strip.show();
}

/**
 * Main game
 *
 * @return {Promise}
 * @rejects {Error}
 */
async function runtime(setup = {}) {
    let lastRender = Date.now();
    const descriptor = await getRuntimeDescriptor(setup);
    const eventState = getEventState(descriptor);

    const loop = timestamp => {
        const progress = timestamp - lastRender;
        const currentState = applyStates(descriptor.state, eventState);
        const nextState = update(copy(currentState), progress);

        if (nextState && stateShouldUpdate(currentState, nextState)) {
            descriptor.state = nextState;
            draw(descriptor);
        }

        lastRender = timestamp;
        xRequestAnimationFrame(loop);
    };

    xRequestAnimationFrame(loop);
}

module.exports = runtime;
