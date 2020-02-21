var express = require('express');
var middlewareTOKEN = require('../middlewares/jwt.js');

var app = express();

var Club = require('../models/club');


// =====================================
// OBTENER TODOS LOS CLUBES 
// =====================================
app.get('/', middlewareTOKEN.verificaToken, (req, res, next) => {
    // PAGINATION
    let index = req.query.index || 0;
    index = Number(index);
    Club.find({}, 'name img')
        .skip(index)
        .limit(5)
        .exec(
            (err, clubDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en la base de datos',
                        error: err
                    });
                }
                Club.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al paginar clubes',
                            error: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        clubes: clubDB,
                        requestUser: req.usuario,
                        total: conteo
                    });
                });
            }
        );

});

// =====================================
// CREAR UN NUEVO CLUB  
// =====================================
app.post('/', middlewareTOKEN.verificaToken, (req, res, next) => {

    var body = req.body;

    var club = new Club({
        name: body.name,
        img: body.img,
        created_by: req.usuario._id,
        updated_by: req.usuario._id
    });

    club.save((err, clubGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un club',
                error: err
            });
        }
        res.status(201).json({
            ok: true,
            club: clubGuardado,
            requestUser: req.usuario
        });
    });
});

// ================================
/*  ACTUALIZAR UN CLUB  */
// ================================
app.put('/:clubId', middlewareTOKEN.verificaToken, (req, res, next) => {

    var id = req.params.clubId;
    var body = req.body;
    Club.findById(id, 'name img created_by updated_by')
        .exec(
            (err, clubBD) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar club',
                        error: err
                    });
                }
                if (!clubBD) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No existe el club con el id: ' + id,
                        errors: { message: 'No existe un club con ese ID' }
                    });
                }

                clubBD.name = body.name;
                console.log(body.name);
                clubBD.img = body.img;
                clubBD.updated_by = req.usuario._id;

                clubBD.save((err, clubGuardado) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar el club',
                            error: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        club: clubGuardado
                    });
                });
            });
});

// ========================
/*  ELIMINAR UN CLUB  */
// ========================
app.delete('/:clubId', middlewareTOKEN.verificaToken, (req, res, next) => {
    var id = req.params.clubId;

    Club.findByIdAndDelete(id, (err, clubBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar club',
                error: err
            });
        }
        if (!clubBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el club con el id: ' + id,
                errors: { message: 'No existe un club con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            club: clubBorrado
        });
    });

});

module.exports = app;