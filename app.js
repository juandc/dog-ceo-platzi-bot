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

// Corremos el servidor :D
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
