# push-push-push-game

## Required Hardwarde

- Arduino AT Mega
- Adafruit NeoPixels
- Arcade Buttons

## Getting started
- Connect the Arduino to the appropriate pins on a the LED breadboard

```
n 8.1.2
npm install
npm start
```

## Mock the hardware

To use mocked hardware use the following command and visit `http://localhost:3000`:

```sh
npm test
```

## Prerequesites
- NodeJS `>= 8`

## Architecture

- Firmata with support for NeoPixel is running on the Arduino MEGA
- NodeJS Johnny Five app connects via serial to the firmata on the arduino
- NodeJS Johnny Five app has full control over the arduino

## Hardware layout

Schema has been created with fritzing, the source file is available at `schema.fzz` and `schema.svg`

## Testing Button
- Pin 51, 53 are configured as input with PULL UP resistors to get clear states for pushed button
- The NeoPixel LEDs must be connected to digital PWM PIN 2 - 13 ( currently 13 ) otherwise it is not working
- The arcade buttons can be attachted to digital PIN 2 - 53
