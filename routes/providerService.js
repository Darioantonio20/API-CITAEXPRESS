// routes/providerService.js
const { Router } = require('express');
const { check } = require('express-validator');
const { providersGet, providersPost, providersPut, providersDelete } = require('../controllers/providerService.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { emailExiste, existeUsuarioPorId } = require('../helpers/db-validator');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', providersGet);

router.post('/', [
    check('nameProvider', 'El nombre es obligatorio').not().isEmpty(),
    check('numberTelProvider', 'El número de teléfono debe ser numérico').isNumeric(),
    check('emailProvider', 'El correo no es válido').isEmail(),
    check('emailProvider').custom(emailExiste),
    check('serviceProvider', 'El servicio es obligatorio').not().isEmpty(),
    check('ubication', 'La ubicación es obligatoria').not().isEmpty(),
    check('passwordProvider', 'El password debe tener más de 6 letras').isLength({ min: 6 }),
    validarCampos
], providersPost);

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], providersPut);

router.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], providersDelete);

module.exports = router;
