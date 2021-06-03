var mongoose = require('mongoose');

/* Utilizar plugion mongoose-validator */
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    role: { type: String, required: false, default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, default: false }
});

/* usuarioSchema.plugin(uniqueValidator,{message: "El correo debe ser único"}); */
usuarioSchema.plugin(uniqueValidator, { message: "El {PATH} debe ser único" }); /* {PATH} reconoce el campo */

/* PODER UTILIZAR EL ARCHIVO FUERA - EXPORTARLO */
module.exports = mongoose.model('Usuario', usuarioSchema);