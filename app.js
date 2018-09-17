'use strict';

// Nuestras dependencias
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

// Algunas cosas que necesitaremos más adelante...
const { PORT = 5000, NODE_ENV = 'development' } = process.env;
const ACCESS_TOKEN = 'EAAddK1PkUaABAKNxZBRn83ofhZC3btFmKNmm8R6eoZCoruMG6u9fVAHph6YgRdrlayTKKKInPF5WlhqZA6KBuxY6vugNy5PpzEu96sZBCcIQr8zO1397kYVI2le8AjI4GrzL1Yb3H07ldthTmMOjA7o7b2Ukm0d4s4KZCAMW8i9tZAYOex9ZBmaH1a0i3vab2rsZD';
const FACEBOOK_URI = 'https://graph.facebook.com/v2.6/me/messages';
const API = {
  breed: breed => `https://dog.ceo/api/breed/${breed}/images/random/1`,
  random: 'https://dog.ceo/api/breeds/image/random',
};

// La configuración de siempre con express.js
const app = express();
app.set('port', PORT);
app.use(bodyParser.json());

// Configuración de nuestras rutas
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// Verificación, sólo vamos a utilizar esta ruta 1 vez
app.get('/webhook', function (req, res) {
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (token === 'Token de verificación de Facebook') res.send(challenge);
  else res.send('Ups! You need to provide the correct token.');
});

// Facebook entra a esta ruta cada vez que
// nuestros usuarios envían un mensaje
app.post('/webhook/', function (req, res) {
  const events = req.body.entry[0].messaging;
  if (!events) return res.sendStatus(404);
  // Por cada mensaje llamamos a la función "handleEvent"
  events.forEach(handleEvent);
  res.sendStatus(200);
});

function handleEvent(event) {
  const senderId = event.sender.id;

  // No vamos a responder mensajes de texto, solo las acciones del menú
  // if (event.message) return handleMessage(senderId, event.message);
  if (event.postback) return handlePostback(senderId, event.postback);
}

function handlePostback(id, postback) {
  const { title, payload } = postback;

  if (payload === 'ABOUT_PAYLOAD' || payload === 'GET_STARTED_PAYLOAD')
    return aboutMessage(id);
  if (payload === 'RANDOM_PAYLOAD') return randomImage(id);
  if (payload.endsWith('_BREED_PAYLOAD')) return breedImage(id, title);
}

function breedImage(id, title) {
  const data = { uri: API.breed(title.toLowerCase()) };

  request(data, function (err, res, body) {
    if (err) return console.log(err);

    const image = JSON.parse(body).message[0];

    const message = {
      "recipient": { "id": id },
      "message": {
        "attachment": {
          "type": "image",
          "payload": {
            "url": image,
          },
        },
      }
    };

    return sendMessage(message);
  })
}

function randomImage(id) {
  const data = { uri: API.random };

  request(data, function (err, res, body) {
    if (err) return console.log(err);

    const image = JSON.parse(body).message;

    const message = {
      "recipient": { "id": id },
      "message": {
        "attachment": {
          "type": "image",
          "payload": {
            "url": image,
          },
        },
      }
    };

    return sendMessage(message);
  })
}

function aboutMessage(id) {
  const message = {
    "recipient": { "id": id },
    "message": {
      "text": "👋 ¡Hola! 🤖 Soy un bot de messenger. Es mejor usar el menú 👇"
    }
  };

  return sendMessage(message);
}

function sendMessage(message) {
  const data = {
    "uri": FACEBOOK_URI,
    "qs": { "access_token": ACCESS_TOKEN },
    "method": "POST",
    "json": message,
  };

  request(data, function (err) {
    if (err) return console.log('Ha ocurrido un error')
    return console.log('Mensaje enviado')
  }
  );
}

// Corremos el servidor :D
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

// curl -X POST -H "Content-Type: application/json" -d '{
// "get_started": {
//   "payload": "GET_STARTED_PAYLOAD"
// }
// }' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=TOKEN_DE_FACEBOOK"

// curl -X POST -H "Content-Type: application/json" -d '{
// "greeting": [
//   {
//     "locale": "default",
//     "text": "Hello {{user_first_name}}!"
//   }
// ]
// }' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=TOKEN_DE_FACEBOOK"

// curl -X POST -H "Content-Type: application/json" -d '{
// "persistent_menu": [{
//   "locale": "default",
//   "composer_input_disabled": false,
//   "call_to_actions": [
//     {
//       "title": "🐶 Razas disponibles",
//       "type": "nested",
//       "call_to_actions": [
//         {
//           "title": "Affenpinscher",
//           "type": "postback",
//           "payload": "AFFENPINSCHER_BREED_PAYLOAD"
//         },
//         {
//           "title": "African",
//           "type": "postback",
//           "payload": "AFRICAN_BREED_PAYLOAD"
//         },
//         {
//           "title": "Airedale",
//           "type": "postback",
//           "payload": "AIREDALE_BREED_PAYLOAD"
//         }
//       ]
//     },
//     {
//       "title": "🔁 Perrito Random",
//       "type": "postback",
//       "payload": "RANDOM_PAYLOAD"
//     },
//     {
//       "title": "💚 Sobre Nosotros",
//       "type": "postback",
//       "payload": "ABOUT_PAYLOAD"
//     }
//   ]
// }]
// }' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=TOKEN_DE_FACEBOOK"


