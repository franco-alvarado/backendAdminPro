var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const SEED = require('../config/config.js').SEED;

var app = express();

var users = require('../models/usuario'); /* users es el nombre de la collection */

app.post('/', (req, res) => {

    var body = req.body;
    console.log(body);
    users.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario: ' + body.email,
                error: err
            });
        }
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: { message: 'Email or password incorrect' }
            });
        }
        // Contraseña incorrecta
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: { message: 'Email or password incorrect' }
            });
        }
        // CREAR TOKEN
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 }); //4 horas
        // Cambio de contraseña, por seguridad

        usuarioBD.password = ':)';
        res.status(200).json({
            ok: true,
            usuario: {
                name: usuarioBD.name,
                email: usuarioBD.email,
                role: usuarioBD.role,
                token: token,
                img: usuarioBD.img
            },
            id: usuarioBD._id
        });
    });
});

module.exports = app;