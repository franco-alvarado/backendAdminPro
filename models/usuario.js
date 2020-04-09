var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es rol permitido'
};

var usuarioSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, required: [true, 'El Email es necesario'], unique: true },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: roles },
    google: { type: Boolean, default: false },
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('users', usuarioSchema); /* users es el nombre de la collection */