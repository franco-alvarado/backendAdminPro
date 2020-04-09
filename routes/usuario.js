var express = require('express');
var bcrypt = require('bcryptjs');
var middlewareTOKEN = require('../middlewares/jwt.js');

var app = express();

var users = require('../models/usuario'); /* users es el nombre de la collection */


// =====================================
// OBTENER TODOS LOS USUARIOS 
// =====================================
app.get('/', middlewareTOKEN.verificaToken, (req, res, next) => {

    users.find({}, 'name email img role')
        .exec(
            (err, usersDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en la base de datos',
                        error: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuarios: usersDB,
                    requestUser: req.usuario
                });
            }
        );

});

// =====================================
// CREAR UN NUEVO USUARIO  
// =====================================
app.post('/', /* middlewareTOKEN.verificaToken, */ (req, res, next) => {

    var body = req.body;

    var user = new users({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                error: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            requestUser: req.usuario
        });
    });
});

// ================================
/*  ACTUALIZAR UN NUEVO USUARIO  */
// ================================
app.put('/:userId', middlewareTOKEN.verificaToken, (req, res, next) => {

    var id = req.params.userId;
    var body = req.body;

    users.findById(id, 'name email img role')
        .exec(
            (err, usuarioBD) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar usuario',
                        error: err
                    });
                }
                if (!usuarioBD) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No existe el usuario con el id: ' + id,
                        errors: { message: 'No existe un usuario con ese ID' }
                    });
                }

                usuarioBD.name = body.name;
                usuarioBD.email = body.email;
                usuarioBD.role = body.role;

                usuarioBD.save((err, usuarioGuardado) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar el usuario',
                            error: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        usuario: usuarioGuardado
                    });
                });
            });
});

// ========================
/*  ELIMINAR UN USUARIO  */
// ========================
app.delete('/:userId', middlewareTOKEN.verificaToken, (req, res, next) => {
    var id = req.params.userId;

    users.findByIdAndDelete(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                error: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el usuario con el id: ' + id,
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});

module.exports = app;