const COLOR_ORDER = {
    RGB: 1,
    GRB: 2,
    BRG: 3
};

class Pixel {
    constructor({ addr, firmata, port, strip, controller = 'FIRMATA' } = {}) {
        this.addr = addr;
        this.firmata = firmata;
        this.port = port;
        this.strip = strip;
        this.controller = controller;
        this.color_value = '#000';
    }

    color(color) {
        this.color_value = color;
        return this;
    }

    _get() {
        return {
            id: this.addr,
            color: this.color_value
        };
    }
}

class Strip {
    constructor({ board, data, length, color_order, controller = 'FIRMATA' } = {}) {
        this.board = board;
        this.data = data;
        this.length = length;
        this.color_order = color_order;
        this.controller = controller;
        this.pixels = Array(this.length).fill(null).map((_, index) => {
            return new Pixel({
                addr: index,
                firmata: {},
                port: 1111,
                controller: this.controller,
                strip: this
            });
        });
    }

    on(eventName, callback) {
        if (eventName === 'ready') {
            setTimeout(() => callback(), 500);
        }
    }

    pixel(index) {
        return this.pixels[index];
    }

    color(color) {
        this.pixels = this.pixels.map((pixel) => pixel.color(color));
        return this;
    }

    clear() {
        return this.color('#000');
    }

    off() {
        this.pixels = this.pixels.map((pixel) => pixel.color('#fff'));
        return this;
    }

    show() {
        this.board._update(this.pixels.map((pixel) => pixel._get()));
    }
}

module.exports = { COLOR_ORDER, Pixel, Strip };
