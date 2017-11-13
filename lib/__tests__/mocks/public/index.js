'use strict';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Ready ...');
    execute();
});

function execute() {
    const socket = io.connect('http://localhost:4000');

    socket.on('update', (data) => {
      const pxs = JSON.parse(data);

      pxs.forEach(px => {
        const el = document.querySelector(`[data-pixel-address="${px.id}"]`);
        el.style.background = px.color;
      });
    });

    document.addEventListener('change', ({ target }) => {
      const { value } = target;
      if (target.getAttribute('data-button-pin')) {
        socket.emit('click', { id: parseInt(value, 10) });
      }
    });
}
