var express = require('express');
var middlewareTOKEN = require('../middlewares/jwt.js');
var fileUplouad = require('express-fileupload');
var fs = require('fs');

var app = express();
// MODELOS
var Usuario = require('../models/usuario');
var Jugador = require('../models/jugador');
var Club = require('../models/club');

app.use(fileUplouad({
    limits: { fileSize: 50 * 1024 * 1024 }
}));

app.put('/:type/:id', middlewareTOKEN.verificaToken, (req, res, next) => {
    var type = req.params.type;
    var id = req.params.id;
    // ONE IMAGE AT LEASE
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Debe subir una imagen'
        });
    }
    // GET FILE NAME
    let image = req.files.img;
    let filename = image.name.split('.');
    let extension = filename[filename.length - 1];
    // MIDDLEWARE EXTENSION ALLOWED
    var extensionAllowed = ['png', 'jpg', 'jpge'];
    var typeAllowed = ['jugador', 'club', 'usuario'];
    // VALIDAR EXTENSION
    if (extensionAllowed.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida!',
            "extensiones validas": extensionAllowed.join(', ')
        });
    }
    // VALIDAR TIPO
    if (typeAllowed.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colleccion no válida!',
            "tipos validos": typeAllowed.join(', ')
        });
    }
    // FILENAME
    filename = `${id}-${new Date().getMilliseconds()}.${extension}`;
    // MOVER EL ARCHIVO DEL TEMPORAL AL PATH
    let path = `./uploads/${type}/${filename}`;
    image.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                error: err
            });
        }
        uploadType(type, id, filename, res);
    });
});

function uploadType(type, id, filename, res) {
    if (type === 'usuario') {
        Usuario.findById(id, 'name email img')
            .exec(
                (err, usuarioBD) => {
                    if (!usuarioBD) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Usuario no existe!',
                            error: err
                        });
                    }
                    //PATH VIEJO
                    var oldPath = `./uploads/usuario/` + usuarioBD.img;
                    //ELIMINA PATH ANTERIOR
                    if (fs.existsSync(oldPath)) {
                        fs.unlink(oldPath, (err) => {
                            if (err) throw err;
                        });
                    }
                    usuarioBD.img = filename;
                    usuarioBD.save((err, usuarioUpdated) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error al actualizar el usuario!',
                                error: err
                            });
                        }
                        return res.status(200).json({
                            ok: true,
                            mensaje: 'Usuario actualizado!',
                            usuario: usuarioUpdated
                        });
                    });
                }
            );
    }
    if (type === 'jugador') {
        Jugador.findById(id, 'name img')
            .exec(
                (err, jugadorBD) => {
                    if (!jugadorBD) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Jugador no existe!',
                            error: err
                        });
                    }
                    //PATH VIEJO
                    var oldPath = `./uploads/jugador/` + jugadorBD.img;
                    //ELIMINA PATH ANTERIOR
                    if (fs.existsSync(oldPath)) {
                        fs.unlink(oldPath, (err) => {
                            if (err) throw err;
                        });
                    }
                    jugadorBD.img = filename;
                    jugadorBD.save((err, jugadorUpdated) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error al actualizar el jugador!',
                                error: err
                            });
                        }
                        return res.status(200).json({
                            ok: true,
                            mensaje: 'Jugador actualizado!',
                            jugador: jugadorUpdated
                        });
                    });
                }
            );
    }
    if (type === 'club') {
        Club.findById(id, 'name img')
            .exec(
                (err, clubBD) => {
                    if (!clubBD) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Club no existe!',
                            error: err
                        });
                    }
                    //PATH VIEJO
                    var oldPath = `./uploads/club/` + clubBD.img;
                    //ELIMINA PATH ANTERIOR
                    if (fs.existsSync(oldPath)) {
                        fs.unlink(oldPath, (err) => {
                            if (err) throw err;
                        });
                    }
                    clubBD.img = filename;
                    clubBD.save((err, clubUpdated) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error al actualizar el club!',
                                error: err
                            });
                        }
                        return res.status(200).json({
                            ok: true,
                            mensaje: 'Club actualizado!',
                            club: clubUpdated
                        });
                    });
                }
            );
    }
}

module.exports = app;