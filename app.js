// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Inicializar variables
var app = express();

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Importar rutas
var appRoute = require('./routes/app');
var usuarioRoute = require('./routes/usuario');
var loginRoute = require('./routes/login');
var clubRoute = require('./routes/club');
var jugadorRoute = require('./routes/jugador');
var searchRoute = require('./routes/search');
var uploadRoute = require('./routes/upload');

// Rutas
app.use('/user', usuarioRoute);
app.use('/login', loginRoute);
app.use('/search', searchRoute);
app.use('/club', clubRoute);
app.use('/jugador', jugadorRoute);
app.use('/upload', uploadRoute);
app.use('/', appRoute);

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