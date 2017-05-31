#include "Arduino.h"

#include "SPI.h"
#include "Ethernet.h"
#include "EthernetUdp.h"

#include "main.h"
#include "Adafruit_NeoPixel.h"

byte ethernetMac[] = {
  0x90, 0xA2, 0xDA, 0x0D, 0x0F, 0xB2
};

IPAddress ip(192, 168, 1, 100);
char server[] = "192.168.1.199";

unsigned int localPort = 8888;
unsigned int serverPort = 7777;

unsigned char packetBuffer[UDP_TX_PACKET_MAX_SIZE];
EthernetUDP udpConnection;

Adafruit_NeoPixel strip = Adafruit_NeoPixel(4, 53, NEO_RGB + NEO_KHZ800);

unsigned int inputs[] = { 30, 32, 34, 36 };
uint8_t inputsState[] = { 0, 0, 0, 0 };

void setup()
{
  Ethernet.begin(ethernetMac, ip);
  udpConnection.begin(localPort);

  Serial.begin(9600);
  Serial.println("Starting Arduino");

  strip.begin();
  strip.show();

  for(unsigned int i=0; i < sizeof(inputs) - 1; i++) {
    pinMode(inputs[0], INPUT_PULLUP);
  }
}

void parseMessage(unsigned char *bytes)
{
  struct incomingMessage msg;
  memcpy(&msg, bytes, sizeof msg);
  switch (msg.command) {
    case 0:
      Serial.println("Command 0 Received");
      Serial.print("Led number");
      Serial.print(msg.led);
      strip.setPixelColor(msg.led, msg.red, msg.green, msg.blue);
      strip.show();
      break;
    default:
      Serial.println("Unknown command");
      break;
  }
}

bool checkButtons()
{
  bool changed = false;

  for(unsigned int i=0; i < sizeof(inputs) - 1; i++) {
    uint8_t val = digitalRead(inputs[i]);

    if (inputsState[i] != val) {
      Serial.println("change");
      Serial.println(val);
      Serial.println(inputsState[i]);

      changed = true;
    }
    inputsState[i] = val;
  }

  return changed;
}

void send_update()
{
  udpConnection.beginPacket(server, serverPort);
  udpConnection.write(inputsState, 4);
  udpConnection.endPacket();
}

void loop()
{
  bool buttonChange = checkButtons();

  if(buttonChange) {
    Serial.println("Button Pressed");
    send_update();
  }

  int packetSize = udpConnection.parsePacket();
  if (packetSize) {
    Serial.println("Incoming Message\n");
    if (packetSize == sizeof(struct incomingMessage)) {
      udpConnection.read(packetBuffer, UDP_TX_PACKET_MAX_SIZE);
      parseMessage(packetBuffer);
    } else {
      Serial.println("Unknown Package Length");
    }
  }
}
