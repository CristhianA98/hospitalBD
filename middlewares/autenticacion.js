var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

/* VERIFICAR TOKEN */
exports.verificaToken = function(req, res, next) {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token Incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario; /* SABER QUIEN REALIZO LA PETICIÓN., QUE USUARIO - DECODED */
        next();
    });
}