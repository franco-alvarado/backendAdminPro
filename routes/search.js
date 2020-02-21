var express = require('express');
var middlewareTOKEN = require('../middlewares/jwt.js');

var app = express();
// MODELOS
var users = require('../models/usuario');
var Jugador = require('../models/jugador');
var Club = require('../models/club');


/* TODO */
app.get('/todo/:busqueda', middlewareTOKEN.verificaToken, (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i'); // busqueda menos sensible

    Promise.all([buscarClubes(busqueda, regex), buscarJugadores(busqueda, regex), buscarUsuarios(busqueda, regex)])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                clubes: respuestas[0],
                jugadores: respuestas[1],
                usuarios: respuestas[2]
            });
        });

});

/* COLECCION */
app.get('/:tabla/any/:busqueda', middlewareTOKEN.verificaToken, (req, res, next) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var promesa;
    switch (tabla) {
        case 'usuario':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'jugador':
            promesa = buscarJugadores(busqueda, regex);
            break;
        case 'club':
            promesa = buscarClubes(busqueda, regex);
            break;
        default:
            return res.status(200).json({
                ok: false,
                data: 'Busqueda erronea! Cambie la tabla de busqueda'
            });

    }
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});



function buscarClubes(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Club.find({ name: regex }, 'name img')
            .exec(
                (err, clubDB) => {
                    if (err) {
                        reject('Error al buscar clubes. ', err);
                    } else {
                        resolve(clubDB);
                    }
                }
            );
    });
}

function buscarJugadores(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Jugador.find({ name: regex }, 'name img')
            .exec(
                (err, jugadorDB) => {
                    if (err) {
                        reject('Error al buscar jugadores. ', err);
                    } else {
                        resolve(jugadorDB);
                    }
                }
            );
    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        users.find({}, 'name email img')
            .or([{ name: regex }, { email: regex }])
            .exec(
                (err, usuarioDB) => {
                    if (err) {
                        reject('Error al buscar usuarios. ', err);
                    } else {
                        resolve(usuarioDB);
                    }
                }
            );

    });
}
module.exports = app;