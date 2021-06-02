/* REQUIRES -> importacion de librerias */
var express = require('express');
var app = express();

var mdAutentication = require('../middlewares/autenticacion');

var Medico = require('../models/medico');


/* RUTAS */
app.get('/', (req, res, next) => {

    /* PAGINAR */
    var desde = req.query.desde || 0;
    desde = Number(desde);

    /* EN CASO DE NO QUERER QUE SE VEA ALGUNOS PARAMETROS COMO PASSWORD */
    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(5)
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar usuarios',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                });

            }
        );

});


/* CREAR NUEVO HOSPITAL */
/* Para que funcione hay que instalar el body-pase */
app.post('/', mdAutentication.verificaToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });

});

/* ACTUALIZAR HOSPITAL */
app.put('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar hospital",
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: "El hospital con el " + id + " no existe",
                errors: "No existe un hospital con ese ID"
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;


        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar hospital",
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });

    });
});

/* ELIMINAR HOSPITAL */
app.delete('/:id', mdAutentication.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar hospital",
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe hospital con ese ID",
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });
});

module.exports = app;