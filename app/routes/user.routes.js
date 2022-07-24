'user strict';

let express         = require('express');
let router          = express.Router();

let userController  = require('../controllers/user.controller.js');
let userValidator   = require('../validators/user.validator.js');
let authHelper      = require('../helpers/auth.helper.js');

router.post('/login', userValidator.validate('loginUserVal'), userController.loginUser);

router.post('/sign-up', userValidator.validate('signUpUserVal'), userController.signUpUser);

router.use(authHelper.isAuthorize);

router.post('/uploadAvatar', userController.checkImageVal, userController.uploadProfileAvatar);
router.post('/:id', userValidator.validate('editUserVal'), userController.editUser);

module.exports      = router;