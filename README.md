<h1 align="center">Push The Button</h1>
<p align="center">
    <img
        src="logo.gif"
        width="100"
        height="100"
        alt="Push the button logo"
    />
</p>

## Contents

* [How to play](#how-to-play)
    * [Green game](#green-game)
    * [Yellow game](#yellow-game)
* [Requirements](#requirements)
    * [Required Hardware](#required-hardware)
    * [Required software](#required-software)
* [Getting started](#getting-started)
    * [Hardware](#hardware)
    * [Development](#development)
        * [Setup](#setup)
        * [Run tests](#run-tests)
        * [Emulate hardware](#emulate-hardware)
        * [Skip setup](#skip-setup)
        * [Solve setup](#solve-setup)
        * [Architecture](#architecture)
        * [Hardware layout](#hardware-layout)
        * [Testing Button](#testing-button)
    * [Develop a new game](#develop-a-new-game)
        * [Create a new game](#create-a-new-game)
        * [The game loop](#the-game-loop)
        * [Exit a game](#exit-a-game)
* [Contribute](#contribute)
* [License](#license)

* * *

## How to play

Currently included in the MVP are two game modes, a easy one and a harder version of the same game. If there are random colors on the board the screensaver is active. Just push a random button to enter the menu. The menu contains **two** games, green and yellow:

### Green game

Start the game by pushing the **green** button. This is a two player game. Ever player chooses a color: **red** or **orange**.

**Play the game:**

* Every player tries to push his own color (red or orange)
* The first player who reaches a score of 10, wins!
* The winning color is shown at the end
* The single purple dot gets you back into the menu
* **Attention:** pushing a non colored dot resets the positions!

### Yellow game

Start the game by pushing the **yellow** button. This is a two player game. Ever player chooses a color: **red** or **orange**.

* Every player tries to push his own color (red or orange)
* After 500ms the position of the dots resets
* The first player who reaches a score of 10, wins!
* The winning color is shown at the end
* The single purple dot gets you back into the menu
* **Attention:** pushing a non colored dot resets the positions!

## Requirements

### Required Hardware

- Arduino AT Mega
- Adafruit NeoPixels
- Arcade Buttons

### Required software

- Node.js >=8
- NPM >= 5

## Getting started

### Hardware

Connect the Arduino to (placed under the table) to the Raspberry Pi with the provided cable. If both are connected you can connect the Arduino with the power cord; all LEDs are blue now. After the boot is completed the menu appears.

### Development

#### Setup

```
npm install
npm start
```

#### Run tests

```sh
npm test
# or
npm run test:watch
```

Also you can lint the files with:

```sh
npm run lint
```

#### Emulate hardware

To use an emulated hardware use the following command and visit `http://localhost:4000`:

```sh
npm run emulate # -- --skipSetup
```

#### Skip setup

Currently included for dev purpose to skip setup for a 4x4 Pixel Board.

```sh
npm start -- --skipSetup
```

#### Solve setup

The setup is to detect the actual board size used on a table. The following steps are necessary to setup the board:

* On start: the first button is `red`
* Press the red button: the button is now `green`
* Press the button on the edge to the right of the green button: the button is now `green`
* Now press the button located on the buttom from the last one pressed: the button is now `green`
* The setup is complete and the game menu appears

The following schema describes the setup again, where:

* `o = off`
* `r = red`
* `g = green`
* `y = yellow`

On setup, the first button appears `red`:

```
r  o  o  o
o  o  o  o
o  o  o  o
o  o  o  o
```

Press the button, it is now `green`:

```
g  o  o  o
o  o  o  o
o  o  o  o
o  o  o  o
```

Next press the most right button, it should also appear `green`:

```
g  o  o  g
o  o  o  o
o  o  o  o
o  o  o  o
```

Now press the bottom button located from the last one pressed, it also should light up `green`:

```
g  o  o  g
o  o  o  o
o  o  o  o
o  o  o  g
```

**The setup is finished the game menu should appear!** The board looks now like this is its final state:

```
g  o  o  o
o  y  o  o
o  o  o  o
o  o  o  o
```

#### Architecture

- Firmata with support for NeoPixel is running on the Arduino MEGA
- NodeJS Johnny Five app connects via serial to the firmata on the arduino
- NodeJS Johnny Five app has full control over the arduino

#### Hardware layout

Schema has been created with [fritzing][1], the source file is available at `schema.fzz` and `schema.svg`

#### Testing Button

- Pin 51, 53 are configured as input with PULL UP resistors to get clear states for pushed button
- The NeoPixel LEDs must be connected to digital PWM PIN 2 - 13 ( currently 13 ) otherwise it is not working
- The arcade buttons can be attachted to digital PIN 2 - 53

[1]: http://fritzing.org/home/


### Develop a new game

In this chapter will be explained how to develop a new game for a table.

#### Create a new game

To create a new game you can create a new JavaScript file with a [CSS supported color name][css] inside the games folder `src/games`:

```shell
# inside root of the project
touch src/games/blue.js
```

Open this file and add the following boilerplate for a game:

```javascript
'use strict';

/**
 * This is the blue game
 */
module.exports = function (state, process, exit) {
    // ...
    return state;
};
```

A game is node module exported function that return the state, passed by function arguments. The three arguments the function get are:

| argument | description |
|----------|-------------|
| state    | The game state that can be changed and will be returned to change the board. |
| process  | The time spend for the actual single process (see [The game loop](#the-game-loop)). |
| exit     | A function to return to the menu. |

The state is an array of `Pixel` objects (the same amount of actual buttons on the table). A `Pixel` represents a button/LED combination of the board. The following example describes the shape of the state:

```javascript
const state = [
    // First pixel:
    {
        x: 0,
        y: 0,
        pressed: false,
        color: '#000000'
    },
    // Second pixel:
    {
        x: 1,
        y: 0,
        pressed: false,
        color: '#000000'
    },
    // more pixel ...
];
```

Every pixel has four values, three of them are **only readable** (at least they don't do anything if you write them): `x` and 'y' representing the position on the table and 'pressed' for the state if the button is pressed.

The fourth property `color` can be set to any css supported color value (even `rgb` and `rgba`) and has a default `#000` for "pixel is turned off".

[css]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value

#### The game loop

If you have the boilerplate code in place you can start to change the table state, e.g.:

```javascript
'use strict';

module.exports = function (state, process, exit) {
    // Change the color of the first pixel
    state[0].color = 'red';
    return state;
};
```

If you would execute this ([maybe by emulation](#emulate-hardware)) the first pixel is always red. To set it indefinitely this is necessary because the state that gets passed down to the game is always fresh (all colors are `#000`). To demonstrate this the following example sets the first pixel to red after 5 seconds:

```javascript
'use strict';

let gameDuration = 5000;

module.exports = function (state, process, exit) {
    gameDuration -= process;
    if (gameDuration <= 0) state[0].color = 'red';
    return state;
};
```

This enables you to think in game loops where you can mutate the state to define your "game world" (the table).

#### Exit a game

To exit a game you can call the passed `exit` method. The following example exits the game after 10 seconds:

```javascript
'use strict';

let gameDuration = 10000;

module.exports = function (state, process, exit) {
    gameDuration -= process;
    if (gameDuration <= 0) return exit();
    return state;
};
```

## Contribute

Feel free to dive in! [Open an issue](https://github.com/sinnerschrader/push-the-button/issues/new) or submit a [Pull Request](https://github.com/sinnerschrader/push-the-button/pull/new/master). :heart:

Please review our [Contributor Guidelines](https://github.com/sinnerschrader/push-the-button/blob/master/CONTRIBUTING.md) and [Code of Conduct](https://github.com/sinnerschrader/push-the-button/blob/master/CODE_OF_CONDUCT.md).


## License

MIT (c) SinnerSchrader and Contributers
