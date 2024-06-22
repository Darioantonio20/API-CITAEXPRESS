const { Schema, model } = require('mongoose');

const ProviderServiceSchema = Schema({
    nameProvider: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    emailProvider: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    passwordProvider: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    numberTelProvider: {
        type: Number,
        required: [true, 'El número de teléfono es obligatorio'],
    },
    serviceProvider: {
        type: String,
        required: [true, 'El servicio es obligatorio']
    },
    ubication: {
        type: String,
        required: [true, 'La ubicación es obligatoria']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

module.exports = model('ProviderService', ProviderServiceSchema);
