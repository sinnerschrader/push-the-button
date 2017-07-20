'use strict';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Ready ...');
    execute();
});

function execute() {
    const socket = io.connect('http://localhost:3000');

    socket.on('update', (pixels) => {
        JSON.parse(pixels).forEach(({ id, color }) => {
            const pixelElement = document.querySelector(`[for="pixel-${id}"]`);
            if (pixelElement) {
                if (color === '#000' || color === 'black') {
                    color = '#fff';
                }
                pixelElement.style.background = color;
            }
        });
    });

    document.addEventListener('click', ({ target }) => {
        const { tagName, value } = target;
        if (tagName.toLowerCase() === 'input') {
            socket.emit('click', { id: parseInt(value, 10) });
        }
    });
}
