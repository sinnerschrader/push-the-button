const commands = process.argv.slice(2);
const mock = require('mock-require');

// Mock library calls for tests
if (commands.includes('--emulate')) {
    mock('johnny-five', require('./emulation/johnny-five'));
    mock('node-pixel', require('./emulation/node-pixel'));
}

const {
    getRuntimeDescriptor,
    applyStates,
    copy,
    stateShouldUpdate,
    xRequestAnimationFrame
} = require('./lib/utils');
const menu = require('./lib/menu');
const initialSetup = commands.includes('--skipSetup')
    ? {
        startPin: 22,
        stripPin: 16,
        originPin: 22,
        maxXPin: 28,
        maxXIndex: 3,
        maxYPin: 52,
        maxYIndex: 15
    }
    : {};

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
async function runtime() {
    let lastRender = Date.now();
    const descriptor = await getRuntimeDescriptor(initialSetup);
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

runtime().catch(err => {
    console.error(err);
    throw err;
});
