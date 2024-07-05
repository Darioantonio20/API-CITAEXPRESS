const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/user.model');
const ProviderService = require('../models/providerService.model');

const login = async(req, res = response) => {
    const { correo, password } = req.body;

    try {
        // Verificar si el correo existe
        let usuario = await Usuario.findOne({ correo });
        let esProveedor = false;
        if (!usuario) {
            usuario = await ProviderService.findOne({ emailProvider: correo });
            esProveedor = true;
        }
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // Si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = esProveedor ? bcryptjs.compareSync(password, usuario.passwordProvider) : bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const googleSignIn = async(req, res = response) => {
    const { id_token } = req.body;

    try {
        // La lógica para verificar el id_token y extraer la información del usuario
        // Supongamos que se obtiene un usuario de la verificación
        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en DB
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        json.status(400).json({
            msg: 'Token de Google no es válido'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}