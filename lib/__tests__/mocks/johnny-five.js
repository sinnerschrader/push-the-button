class Pin {
    constructor(opts = {}) {
        if (typeof opts === 'number') {
            this.id = opts;
            this.pin = opts;
            this.type = 'digital';
            this.mode = Pin.INPUT;
        } else {
            this.id = opts.pin || 0;
            this.pin = opts.pin || 0;
            this.type = opts.type || 'digital';
            this.mode = opts.mode || Pin.INPUT;
        }
    }
}

Pin.INPUT = 0;
Pin.OUTPUT = 1;
Pin.ANALOG = 2;
Pin.PWM = 3;
Pin.SERVO = 4;

class Board {
    constructor({ port = '/dev/tty.usbmodem****' } = {}) {
        this.socket = null;
        this.port = port;
        this.pins = Array(60).fill(null).reduce((pins, _, index) => {
            pins[index] = new Pin(index);
            return pins;
        }, {});
    }

    on(eventName, callback) {
        if (eventName === 'ready') {
            console.log('Board is ready ... listen on localhost:4000');
            callback();
        }

        if (eventName === 'error') {
            // ignore error case
        }
    }

    _update(pixels) {
        if (!this.socket && this.io) {
            this.io.on('connection', (socket) => {
                this.socket = socket;
                socket.emit('update', JSON.stringify(pixels));
            });
        }
        if (this.socket) {
            this.socket.emit('update', JSON.stringify(pixels));
        }
    }
}

class Button {
    constructor({ pin, isPulldown } = {}) {
        this.pin = parseInt(pin, 10);
        this.isPulldown = isPulldown;
        this.cb = null;
    }

    on(eventName, callback) {
        if (eventName === 'down') {
          this.cb = callback;
        }
    }

    removeListener(eventName) {
        if (eventName === 'down') {
          this.cb = null;
        }
    }
}

module.exports = { Board, Button, Pin };
