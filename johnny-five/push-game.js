let five = require("johnny-five");
let board = new five.Board();
let pixel = require("node-pixel");

let strip = null;

board.on("ready", function() {

  console.log('BOARD is ready');

  const button1 = new five.Button({
    pin: 8,
    isPullup: true
  });

  const button2 = new five.Button({
    pin: 9,
    isPullup: true
  });

  strip = new pixel.Strip({
    board: this,
    controller: 'FIRMATA',
    data: 13,
    length: 4,
    color_order: pixel.COLOR_ORDER.RGB
  });

  strip.on("ready", function() {
    console.log("Strip ready, let's go");
  });

  button1.on("down", function() {
    staticRainbow();
  });

  button1.on("up", function() {
    strip.off();
  });

  button2.on("down", function() {
    strip.colour("orange");
    strip.show();
  });

  button2.on("up", function() {
    strip.off();
  });

  function staticRainbow(){
    console.log('staticRainbow');

    var showColor;
    for(var i = 0; i < strip.length; i++) {
        showColor = colorWheel( ( i*256 / strip.length ) & 255 );
        strip.pixel( i ).color( showColor );
    }
    strip.show();
  }

  // Input a value 0 to 255 to get a color value.
  // The colours are a transition r - g - b - back to r.
  function colorWheel( WheelPos ){
    var r,g,b;
    WheelPos = 255 - WheelPos;

    if ( WheelPos < 85 ) {
        r = 255 - WheelPos * 3;
        g = 0;
        b = WheelPos * 3;
    } else if (WheelPos < 170) {
        WheelPos -= 85;
        r = 0;
        g = WheelPos * 3;
        b = 255 - WheelPos * 3;
    } else {
        WheelPos -= 170;
        r = WheelPos * 3;
        g = 255 - WheelPos * 3;
        b = 0;
    }
    // returns a string with the rgb value to be used as the parameter
    return "rgb(" + r +"," + g + "," + b + ")";
  }
});
