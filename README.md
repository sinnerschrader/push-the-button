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
        * [Architecture](#architecture)
        * [Hardware layout](#hardware-layout)
        * [Testing Button](#testing-button)
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
npm emulate # -- --skipSetup
```

#### Skip setup

Currently included for dev purpose to skip setup for a 4x4 Pixel Board.

```sh
npm start -- --skipSetup
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


## Contribute

Feel free to dive in! [Open an issue](https://github.com/sinnerschrader/push-the-button/issues/new) or submit a [Pull Request](https://github.com/sinnerschrader/push-the-button/pull/new/master). :heart:

Please review our [Contributor Guidelines](https://github.com/sinnerschrader/push-the-button/blob/master/CONTRIBUTING.md) and [Code of Conduct](https://github.com/sinnerschrader/push-the-button/blob/master/CODE_OF_CONDUCT.md).


## License

MIT (c) SinnerSchrader and Contributers
