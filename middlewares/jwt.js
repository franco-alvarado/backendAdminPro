var jwt = require('jsonwebtoken');

const SEED = require('../config/config.js').SEED;

// =====================================
// VERIFICAR EL TOKEN
// =====================================

exports.verificaToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'token incorrecto',
                error: err
            });
        }
        // PARA SABER QUIEN REALIZA LA PETICIÓN
        req.usuario = decoded.usuario;

        next();
    });
};