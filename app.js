// Requires
var express = require('express');
var mongoose = require('mongoose');


// Inicializar variables
var app = express();


// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Ok'
    });
});

// Mongo db
var db = mongoose.connection;
db.openUri('mongodb://localhost:27017/adminPro', (err, res) => {
    if (err) throw err;

    console.log('MongoDB corriendo en el puerto 27017: \x1b[32m%s\x1b[0m', 'Online');

});



// Escuchar peticiones
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'Online');
});