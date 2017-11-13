module.exports = { renderPixels };

function renderPixels(pixels) {
    return (req, res) => {
      res.send(`
        <html>
        <head>
            <title>Push the Game</title>
            <script src="static/socket.io.js"></script>
            <script src="static/index.js"></script>
            <link rel="stylesheet" href="static/index.css" />
        </head>
        <body>
            <form class="table">
                ${pixels.map((pixel, index) => {
                  return `
                    ${index % 4 === 0 ? '<br />' : ''}
                    <label class="button">
                      <input
                        class="plastic"
                        type="checkbox"
                        value="${index}"
                        data-button-pin="${pixel.pin}"
                        data-pixel-address="${index}"
                        />
                    </label>`;
                }).join('')}
            </form>
        </body>
        </html>`
      );
    };
};
