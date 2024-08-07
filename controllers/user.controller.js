const { response, request } = require('express');
const Usuario = require('../models/user.model');
const bcryptjs = require('bcryptjs');

const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosGetById = async(req, res = response) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }
        res.json(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) {
        const salt = bcryptjs.genSaltSync();       // Encriptar la contraseña
        resto.password = bcryptjs.hashSync( password, salt );
    }
    const usuario = await Usuario.findByIdAndUpdate( id, resto );
    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosPost = async (req, res) => {

    const { nombre, correo, password, numeroTel} = req.body;
    const usuario = new Usuario({ nombre, correo, password, numeroTel });
    const salt = bcryptjs.genSaltSync();        //Encriptar la contraseña
    usuario.password = bcryptjs.hashSync(password, salt);
    await usuario.save();   //guardar en db
    res.json({
        usuario
    });
}

const usuariosDelete = async (req, res) => {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    res.json({
        usuario 
    });
}

module.exports = {
    usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosGetById
}