#include "Arduino.h"

#include "SPI.h"
#include "Ethernet.h"
#include "EthernetUdp.h"

#include "main.h"

byte ethernetMac[] = {
  0x90, 0xA2, 0xDA, 0x0D, 0x0F, 0xB2
};

IPAddress ip(192, 168, 1, 100);
char server[] = "192.168.1.199";

unsigned int localPort = 8888;
unsigned int serverPort = 7777;

unsigned char packetBuffer[UDP_TX_PACKET_MAX_SIZE];
EthernetUDP udpConnection;

void setup()
{
  Ethernet.begin(ethernetMac, ip);
  udpConnection.begin(localPort);

  Serial.begin(9600);
  Serial.println("Starting Arduino");
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
      break;
    default:
      Serial.println("Unknown command");
      break;
  }
}

void loop()
{
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
