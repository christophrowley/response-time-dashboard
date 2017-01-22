const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();

app.use(function (req, res) {
  res.send({ msg: "hello" });
});

const messages = [
  'Hello',
  'darkness',
  'my',
  'old',
  'friend',
];

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  const location = url.parse(ws.upgradeReq.url, true);

  ws.on('message', message => {
    console.log('received: %s', message);
  });

  for (let i = 0; i < messages.length; i++) {
    setTimeout(() => ws.send(messages[i]), i * 1000);
  }
});

server.listen(3000, () => {
  console.log('Listening on %d', server.address().port);
});
