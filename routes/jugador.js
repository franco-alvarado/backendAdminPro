var express = require('express');
var middlewareTOKEN = require('../middlewares/jwt.js');

var app = express();

var Jugador = require('../models/jugador');


// =====================================
// OBTENER TODOS LOS JUGADORES 
// =====================================
app.get('/', middlewareTOKEN.verificaToken, (req, res, next) => {
    // PAGINATION
    let index = req.query.index || 0;
    index = Number(index);

    Jugador.find({}, 'name rut img club created_by updated_by')
        .skip(index)
        .limit(5)
        .populate('club', '_id name img')
        .exec(
            (err, jugadorDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en la base de datos',
                        error: err
                    });
                }

                Jugador.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al paginar jugadores',
                            error: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        jugadores: jugadorDB,
                        requestUser: req.usuario,
                        total: conteo
                    });
                });

            }
        );

});

// =====================================
// CREAR UN NUEVO JUGADOR  
// =====================================
app.post('/', middlewareTOKEN.verificaToken, (req, res, next) => {

    var body = req.body;

    var jugador = new Jugador({
        name: body.name,
        img: body.img,
        rut: body.rut,
        club: body.club,
        created_by: req.usuario._id,
        updated_by: req.usuario._id
    });

    jugador.save((err, jugadorGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un jugador',
                error: err
            });
        }
        res.status(201).json({
            ok: true,
            jugador: jugadorGuardado,
            requestUser: req.usuario
        });
    });
});

// ================================
/*  ACTUALIZAR UN CLUB  */
// ================================
app.put('/:jugadorId', middlewareTOKEN.verificaToken, (req, res, next) => {

    var id = req.params.jugadorId;
    var body = req.body;
    Jugador.findById(id, 'name rut img club created_by updated_by')
        .exec(
            (err, jugadorBD) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar jugador',
                        error: err
                    });
                }
                if (!jugadorBD) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No existe el jugador con el id: ' + id,
                        errors: { message: 'No existe un jugador con ese ID' }
                    });
                }

                jugadorBD.name = body.name;
                jugadorBD.rut = body.rut;
                jugadorBD.img = body.img;
                jugadorBD.club = body.club;
                jugadorBD.updated_by = req.usuario._id;

                jugadorBD.save((err, jugadorGuardado) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar el club',
                            error: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        jugador: jugadorGuardado
                    });
                });
            });
});

// ========================
/*  ELIMINAR UN CLUB  */
// ========================
app.delete('/:jugadorId', middlewareTOKEN.verificaToken, (req, res, next) => {
    var id = req.params.jugadorId;

    Jugador.findByIdAndDelete(id, (err, jugadorBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar jugador',
                error: err
            });
        }
        if (!jugadorBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el jugador con el id: ' + id,
                errors: { message: 'No existe un jugador con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            jugador: jugadorBorrado
        });
    });

});

module.exports = app;