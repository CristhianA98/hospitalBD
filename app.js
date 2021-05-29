/* REQUIRES -> importacion de librerias */
var express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');


/* Inicializar variables -> donde utilizamos la variable */
var app = express();

/* Body parser 
    Parse applicattion /x-www-form-urlencoded - (MIDDLEWEARE -> funciones que se ejecutan siempre ) */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* Importar rutas */
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

/* Conexión a la base de datos */
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
    if (err) throw err;
    console.log('Base de datos \x1b[32m%s\x1b[0m', 'online');
});

/* MiddleWeare - Realice algo antes de realizar las rutas */
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


/* Escuchar el puerto - cualquier puerto */
app.listen(3010, () => {
    console.log('Express server en el puerto 3010 \x1b[32m%s\x1b[0m', 'online');
});