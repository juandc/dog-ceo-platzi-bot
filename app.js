'use strict';

// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

// Helpers
const FACEBOOK_URI = 'https://graph.facebook.com/v2.6/me/messages';
const ACCESS_TOKEN = 'EAACvfQZANqcMBABfZBc2kGfGF5JfOrXhbZAf2MEsrL7masS8TB1eNl3X3tKE85VVXLCsWK0FsaKD8He4gQdK8ZBJkafqI6ZAPrGZBgJ9OW1ZAIKqGOAv2rW0PUW2Nr8BZCkqCTsKSgWX4gqHnFGq7NqsXdk0OYmzREsdi5FBMZAeZCnAZDZD';
const { PORT = 5000, NODE_ENV = 'development' } = process.env;

// Express Configuration
const app = express();
app.set('port', PORT);
app.use(bodyParser.json());

// Express Routes
app.get('/', function (req, res) {
  res.send('Hello PlatziBot!');
});

app.get('/webhook', function (req, res) {
  const token = req.query[hub.verify_token];
  const challenge = req.query[hub.challenge];
  
  if (token === 'DOG_CEO_PLATZI_BOT__HELLO') {
    res.send(challenge);
  } else {
    res.send('Ups! You need to provide the correct token.');
  }
});

app.post('/webhook', function (req, res) {
  const webhook_event = req.body.entry[0];

  if (webhook_event.messaging) webhook_event.messaging.forEach(handleEvent);

  res.sendStatus(200);
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

// Utils
function handleEvent(event) {
  const senderId = event.sender.id;
  
  if (event.message) return handleMessage(senderId, event.message);
  // if (event.postback) return handlePostback(senderId, event.postback.payload);
}

function handleMessage(id, message) {
  if (message.text) return defaultMessage(id);
  // if (message.attachments) return handleAttachments(senderId, event)
}

function defaultMessage(id) {
  const message = {
    "recipient": { "id": id },
    "message": {
      "text": "Bienvenido a Dog CEO Platzi Bot :D",
      "quick_replies": [
        {
          "content_type": "text",
          "title": "Razas de Perritos",
          "payload": "DOG_BREEDS__PAYLOAD",
        },
        {
          "content_type": "text",
          "title": "Acerca de nosotros",
          "payload": "ABOUT__PAYLOAD",
        },
      ],
    },
  };

  sendMessage(message);
}


function sendMessage(message) {
  const data = {
    json: message,
    method: 'POST',
    uri: FACEBOOK_URI,
    qs: { access_token: ACCESS_TOKEN },
  };

  request(data, function (err, res, body) {
    if (err) return console.log('Error: ', err);
    return console.log("Mensaje enviado!");
  });
}
