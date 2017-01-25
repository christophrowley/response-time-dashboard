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
  let continueSending = true;

  ws.on('message', message => {
    if (message === 'stop') {
      continueSending = false;
    }
  });

  function transmitLatency() {
    const then = Date.now();
    superagent.get('http://google.com')
      .then(() => {
        const now = Date.now();
        ws.send(JSON.stringify({
          requestedAt: then.toISOString(),
          responseTime: now - then,
        });
      })
      .catch(err => ws.send(0));

    if (continueSending) transmitLatency();
  }

  transmitLatency();
});

server.listen(3000, () => {
  console.log('Listening on %d', server.address().port);
});
