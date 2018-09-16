'use strict';

// Nuestras dependencias
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

// Algunas cosas que necesitaremos más adelante...
const { PORT = 5000, NODE_ENV = 'development' } = process.env;
const ACCESS_TOKEN = 'Nuestro Token de Facebook';
const FACEBOOK_URI = 'https://graph.facebook.com/v2.6/me/messages';
const API = {
  breed: breed => `https://dog.ceo/api/breed/${breed}/images`,
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

  if (payload === 'ABOUT_PAYLOAD') return aboutMessage(id);
  if (payload === 'RANDOM_PAYLOAD') return randomImage(id);
  if (payload.endsWith('_BREED_PAYLOAD')) return breedImage(id, title);
}

// Corremos el servidor :D
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
