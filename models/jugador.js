var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var jugadorSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    rut: { type: String, required: [true, 'El rut es necesario'] },
    img: { type: String, required: false },
    club: { type: Schema.Types.ObjectId, ref: 'club', required: [true, 'El id del club es obligatorio'] },
    created_by: { type: String, required: [true, 'dato necesario'] },
    updated_by: { type: String, required: [true, 'dato necesario'] }
}, { collection: 'jugador' });

jugadorSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('jugador', jugadorSchema); /* jugador es el nombre de la collection */