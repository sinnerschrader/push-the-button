const renderPixels = (length) => {
    const pixels = Array(length).fill(null);
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
            <form>
                ${pixels.map((_, index) => {
                    // This is a hack to simulate pin slots
                    const pixelSlot = index * 2;
                    let br = '';
                    if (index % 4 === 0) {
                        br += '<br />';
                    }
                    return `
                    ${br}
                    <label style="border:1px solid black;background:#fff" for="pixel-${pixelSlot}">
                        <input type="checkbox" value="${pixelSlot}" id="pixel-${pixelSlot}" />
                    </label>`;
                }).join('')}
            </form>
        </body>
        </html>`
        );
    };
};

module.exports = { renderPixels };
