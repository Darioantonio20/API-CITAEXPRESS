// routes/providerService.js
const { Router } = require('express');
const { check } = require('express-validator');
const { providersGet, providersPost, providersPut, providersDelete, providersGetById } = require('../controllers/providerService.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { emailExiste} = require('../helpers/db-validator');

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
    check('emailProvider').optional().isEmail(),
    check('emailProvider').optional().custom(emailExiste),
    check('nameProvider', 'El nombre es obligatorio').optional().not().isEmpty(),
    check('numberTelProvider', 'El número de teléfono debe ser numérico').optional().isNumeric(),
    check('serviceProvider', 'El servicio es obligatorio').optional().not().isEmpty(),
    check('ubication', 'La ubicación es obligatoria').optional().not().isEmpty(),
    check('passwordProvider', 'El password debe tener más de 6 letras').optional().isLength({ min: 6 }),
    validarCampos
], providersPut);

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
  //check('id').custom(existeUsuarioPorId),
    validarCampos
], providersGetById);

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
], providersDelete);

module.exports = router;
