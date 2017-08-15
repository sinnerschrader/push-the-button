const commands = process.argv.slice(2);
const mock = require('mock-require');

// Mock library calls for tests
if (commands.includes('--emulate')) {
    mock('johnny-five', require('./emulation/johnny-five'));
    mock('node-pixel', require('./emulation/node-pixel'));
}

const runtime = require('./index');

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

runtime(initialSetup).catch(err => {
    console.error(err);
    throw err;
});
