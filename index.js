'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');
const bodyParser = require('body-parser');

const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  let replyText = '';
  if (event.message.text === '天気教えて') {
    console.log(event.source.userId);
    replyText = 'ちょっとまってね';
    getNodeVer(event.source.userId);
  } else {
    replyText = event.message.text;
  }

  // create a echoing text message
  const echo = {
    type: 'text',
    text: replyText
  };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

const getNodeVer = async (userId) => {
  const res = await axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=130010');
  const item = res.data;

  await client.pushMessage(userId, {
    type: 'text',
    text: item.description.text,
  });
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});