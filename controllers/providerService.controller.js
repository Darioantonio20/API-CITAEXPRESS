const { response, request } = require('express');
const ProviderService = require('../models/providerService.model');
const bcryptjs = require('bcryptjs');

const providersGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, providers] = await Promise.all([
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

    const providerService = await ProviderService.findByIdAndUpdate(id, resto, { new: true });
    res.json(providerService);
}

const providersDelete = async (req, res = response) => {
    const { id } = req.params;
    const provider = await ProviderService.findByIdAndUpdate(id, { estado: false });
    res.json({
        provider
    });
}

const providersGetById = async (req, res = response) => {
    const { id } = req.params;
    try {
        const provider = await ProviderService.findById(id);
        if (!provider) {
            return res.status(404).json({
                msg: 'Proveedor de servicio no encontrado'
            });
        }
        res.json(provider);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    providersGet,
    providersPost,
    providersPut,
    providersDelete,
    providersGetById
};
