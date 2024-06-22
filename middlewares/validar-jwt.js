const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/user.model');
const ProviderService = require('../models/providerService.model');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid, type } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        let usuario;

        if (type === 'user') {
            // Leer el usuario que corresponde al uid
            usuario = await Usuario.findById(uid);
        } else if (type === 'providerService') {
            // Leer el proveedor de servicios que corresponde al uid
            usuario = await ProviderService.findById(uid);
        }

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario/proveedor no existe en DB'
            });
        }

        // Verificar si el uid tiene estado true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - usuario/proveedor con estado: false'
            });
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    validarJWT
}
