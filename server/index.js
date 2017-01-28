const express = require('express');
const http = require('http');
const superagent = require('superagent');
const url = require('url');
const WebSocket = require('ws');

const app = express();

app.use(function (req, res) {
  res.send({ msg: "hello" });
});


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  const location = url.parse(ws.upgradeReq.url, true);
  let continueSending = true;
  console.log('Connection established');

  ws.on('message', message => {
    if (message === 'stop') {
      continueSending = false;
    }
  });

  function transmitLatency() {
    const before = Date.now();
    superagent.get('http://google.com')
      .then(() => {
        const now = Date.now();
        const payload = {
          requestedAt: new Date(before).toISOString(),
          responseTime: now - before,
        };
        console.log('Sending', payload);
        ws.send(JSON.stringify(payload));
      })
      .catch(err => {
        console.log('No love', err);
        ws.send(0)
      });

    if (continueSending) setTimeout(() => transmitLatency(), 1000);
  }

  transmitLatency();
});

server.listen(3000, () => {
  console.log('Listening on %d', server.address().port);
});
