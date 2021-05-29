/* REQUIRES -> importacion de librerias */
var express = require('express');
var app = express();

var mdAutentication = require('../middlewares/autenticacion');

/* ENCRIPTAR PASSWORD */
var bcrypt = require('bcryptjs');

var Usuario = require('../models/usuario');
const usuario = require('../models/usuario');


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

    /* EN CASO DE NO QUERER QUE SE VEA ALGUNOS PARAMETROS COMO PASSWORD */
    Usuario.find({}, 'nombre email img role').exec(
        (err, usuarios) => {
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


/* CREAR NUEVO USUARIO */
/* Para que funcione hay que instalar el body-pase */
app.post('/', mdAutentication.verificaToken, (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuariosGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuariosGuardado,
            usuariotoken: req.usuario
        });
    });

});

/* ACTUALIZAR USUARIO */
app.put('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: "El usuario con el " + id + " no existe",
                errors: "No existe un usuario con ese ID"
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar usuario",
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });

    });
});

/* ELIMINAR USUARIO */
app.delete('/:id', mdAutentication.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al borrar usuario",
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe usuario con ese ID",
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});

module.exports = app;