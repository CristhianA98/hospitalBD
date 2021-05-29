/* REQUIRES -> importacion de librerias */
var express = require('express');

/* Inicializar variables -> donde utilizamos la variable */

var app = express();
/* RUTAS */
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    })
});

module.exports = app;