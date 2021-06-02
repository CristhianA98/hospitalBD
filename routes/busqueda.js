/* REQUIRES -> importacion de librerias */
var express = require('express');

/* Inicializar variables -> donde utilizamos la variable */
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

/* -------------------------------------------------------------------------
--- Busqueda específica - hospital - medico - usuario
----------------------------------------------------------------------------*/

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;

    var regex = new RegExp(busqueda, 'i'); /* Expresión Regular -  Insensible a las mayusculas y minusculas */

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'los tipos de búsqueda solo son: usuarios, médicos y hospitales',
                error: { message: 'Tipo de colección no valida' }
            });
    }

    promesa.then(data => {
        res.status(400).json({
            ok: true,
            /* tabla: data */
            [tabla]: data /* el [] permite ver el nombre del campo */
        });
    });
});





/* -------------------------------------------------------------------------
--- Busqueda general
----------------------------------------------------------------------------*/

/* RUTAS */
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i'); /* Expresión Regular -  Insensible a las mayusculas y minusculas */

    Promise.all(
        [buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ]
    ).then(respuestas => {
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    }); /* EJECUTAR UN ARREGLO DE PROMESAS */

    /* PROMESA */
    /*     buscarHospitales(busqueda, regex).then(hospitales => {
            res.status(200).json({
                ok: true,
                hospitales: hospitales
            });
        }); */

});

function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        /*         Hospital.find({ nombre: regex }, (err, hospitales) => {
                    if (err) {
                        reject('Error al cargar hospitales ', err);
                    } else {
                        resolve(hospitales);
                    }
                }); */

        Hospital.find({ nombre: regex }).populate('usuario', 'nombre email').exec((err, hospitales) => {
            if (err) {
                reject('Error al cargar hospitales ', err);
            } else {
                resolve(hospitales);
            }
        });

    });

}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex }, (err, medicos) => {
            if (err) {
                reject('Error al cargar medicos ', err);
            } else {
                resolve(medicos);
            }
        });

    });

}


function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuario', err);
                } else {
                    resolve(usuarios);
                }
            });

    });

}

module.exports = app;