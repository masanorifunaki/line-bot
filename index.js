'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
  console.log(req.body.events);
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let replyText = '';
  if (event.message.text === 'こんにちは') {
    replyText = 'こんばんわの時間ですよ';
  } else {
    replyText = 'うざ';
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText
  });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);