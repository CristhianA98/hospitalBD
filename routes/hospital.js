/* REQUIRES -> importacion de librerias */
var express = require('express');
var app = express();

var mdAutentication = require('../middlewares/autenticacion');

var Hospital = require('../models/hospital');


/* RUTAS */
app.get('/', (req, res, next) => {

    /*     Usuario.find({}, (err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar usuarios',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        }); */

    /* PAGINAR */
    var desde = req.query.desde || 0;
    desde = Number(desde);

    /* EN CASO DE NO QUERER QUE SE VEA ALGUNOS PARAMETROS COMO PASSWORD */
    Hospital.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5)
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar usuarios',
                        errors: err
                    });
                }

                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });
                });

            }
        );

});

/* VERIFICAR TOKEN -> GET PUEDE UTILIZAR CUALQUIERA, LOS DEMÄS DEBEN TENER AUTENTICACIÓN - de aquí para abajo debe estar autenticada (TOKEN) */
/* app.use('/', (req, res, next) => {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token Incorrecto',
                errors: err
            });
        }

        next();

    });
}); */


/* CREAR NUEVO HOSPITAL */
/* Para que funcione hay que instalar el body-pase */
app.post('/', mdAutentication.verificaToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });

});

/* ACTUALIZAR HOSPITAL */
app.put('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar hospital",
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: "El hospital con el " + id + " no existe",
                errors: "No existe un hospital con ese ID"
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;


        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar hospital",
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });

    });
});

/* ELIMINAR HOSPITAL */
app.delete('/:id', mdAutentication.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar hospital",
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe hospital con ese ID",
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });
});

module.exports = app;