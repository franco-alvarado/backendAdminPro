var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var clubSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'], unique: true },
    img: { type: String, required: false },
    created_by: { type: String, required: [true, 'dato necesario'] },
    updated_by: { type: String, required: [true, 'dato necesario'] }
}, { collection: 'club' });

clubSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('club', clubSchema); /* club es el nombre de la collection */