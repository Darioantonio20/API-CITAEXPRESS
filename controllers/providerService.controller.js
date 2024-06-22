// controllers/providerService.controller.js
const { response, request } = require('express');
const ProviderService = require('../models/providerService.model');
const bcryptjs = require('bcryptjs');

const providersGet = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, providers ] = await Promise.all([
        ProviderService.countDocuments(query),
        ProviderService.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        providers
    });
}

const providersPost = async (req, res = response) => {
    const { nameProvider, emailProvider, passwordProvider, numberTelProvider, serviceProvider, ubication } = req.body;
    const provider = new ProviderService({ nameProvider, emailProvider, passwordProvider, numberTelProvider, serviceProvider, ubication });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    provider.passwordProvider = bcryptjs.hashSync(passwordProvider, salt);
    
    // Guardar en DB
    await provider.save();
    
    res.json({
        provider
    });
}

const providersPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, passwordProvider, google, emailProvider, ...resto } = req.body;

    if (passwordProvider) {
        const salt = bcryptjs.genSaltSync();
        resto.passwordProvider = bcryptjs.hashSync(passwordProvider, salt);
    }

    const provider = await ProviderService.findByIdAndUpdate(id, resto);
    res.json(provider);
}

const providersDelete = async (req, res = response) => {
    const { id } = req.params;
    const provider = await ProviderService.findByIdAndUpdate(id, { estado: false });
    res.json({
        provider
    });
}

module.exports = {
    providersGet,
    providersPost,
    providersPut,
    providersDelete
}
