const udpPort = 7777;
const dgram = require('dgram');

const server = dgram.createSocket('udp4');

const client = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);

  const buffer = Buffer.alloc(5);
  // command
  buffer[0] = 0;
  // led number 0 - 3
  buffer[1] = 1;
  // red 0 - 255
  buffer[2] = 50
  // green 0 - 255
  buffer[3] = 50
  // blue 0 - 255
  buffer[4] = 50

  client.send(buffer, 8888, '192.168.1.100', (err) => {
    if(err) {
      console.log(`client error:\n${err.stack}`);
    }
  });
});

server.bind(udpPort);
