var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Config
const SEED = require('../config/config.js').SEED;
const GOOGLE_ID = require('../config/config.js').GOOGLE_ID;

var app = express();

var Usuario = require('../models/usuario'); /* users es el nombre de la collection */

// =====================
// SIGN IN NORMAL 
// =====================
app.post('/', (req, res) => {

    var body = req.body;
    console.log(body);
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return error500('Error al buscar usuario: ' + body.email, err, res);
        }
        if (!usuarioBD) {
            return error400('Credenciales incorrectas', res);
        }
        // Contraseña incorrecta
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return error400('Credenciales incorrectas', res);
        }
        if (!usuarioBD.active) {
            return error400('Cuenta no activada', res);
        }
        // Cambio de contraseña, por seguridad
        usuarioBD.password = ':)';
        // CREAR TOKEN && RESPUESTA
        crearTokenRespuesta(SEED, usuarioBD, res);
    });
});

// CREAR TOKEN Y 200 RES
function crearTokenRespuesta(SEED, usuarioBD, res) {
    var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 }); //4 horas
    return res.status(200).json({
        ok: true,
        usuario: {
            name: usuarioBD.name,
            email: usuarioBD.email,
            role: usuarioBD.role,
            token: token,
            img: usuarioBD.img
        },
        usuarioId: usuarioBD._id
    });
}
// 500 ERROR
function error500(mensaje, err, res) {
    res.status(500).json({
        ok: false,
        mensaje: mensaje,
        error: err
    });
}
// 400 ERROR
function error400(mensaje, res) {
    res.status(400).json({
        ok: false,
        mensaje: mensaje
    });
}
// 403 ERROR
function error403(mensaje, res) {
    res.status(403).json({
        ok: false,
        mensaje: mensaje
    });
}

module.exports = app;