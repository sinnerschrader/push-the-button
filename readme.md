# push-push-push-game

## Required Hardwarde

- Arduino AT Mega
- Adafruit NeoPixels
- Arcade Buttons

## Getting started

- Connect the Arduino to the appropriate pins on a the LED breadboard
- Power up the Arduino
- Perform steps for Local Development Environment if necessary

## Local Development Environment
- [Arduino IDE 1.8.3](https://www.arduino.cc/en/Main/Software)
- NodeJS `>= 6`

### Arduino development
- open Arduino IDE
- under Sketch -> Include Library -> Manage Libraries -> Install Firmata
- under Tools -> select Arduino/Genuino Mega or Mega 2560
- under Tools -> select Port /dev/usbmodem[xxxx]
- to verify the connection click under Tools -> Get Board Info
- open node_pixel_firmata/node_pixel_firmata.ino
- upload code to arduino over Sketch -> Upload

### Node Johnny Five app

```
node push-game.js
```

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
