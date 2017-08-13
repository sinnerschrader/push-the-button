/* global io */
/* eslint-env browser */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Ready ...');
    execute();
});

function execute() {
    const socket = io.connect('http://localhost:4000');

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

    document.addEventListener('mousedown', ({ target }) => {
        const { tagName } = target;
        if (tagName.toLowerCase() === 'label') {
            const id = parseInt(target.querySelector('input').value, 10);
            socket.emit('mousedown', { id });
        }
    });

    document.addEventListener('mouseup', ({ target }) => {
        const { tagName } = target;
        if (tagName.toLowerCase() === 'label') {
            const id = parseInt(target.querySelector('input').value, 10);
            socket.emit('mouseup', { id });
        }
    });
}
