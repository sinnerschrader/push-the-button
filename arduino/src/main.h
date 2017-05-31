#include "Arduino.h"

struct incomingMessage {
  uint8_t command;
  uint8_t led;
  uint8_t green;
  uint8_t red;
  uint8_t blue;
};
