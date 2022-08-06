'user strict';

let express         = require('express');
let router          = express.Router();

let userController  = require('../controllers/user.controller.js');
let userValidator   = require('../validators/user.validator.js');
let authHelper      = require('../helpers/auth.helper.js');

/* Self-Registration */
router.post('/sign-up', userValidator.validate('signUpUserVal'), userController.signUpUser);

/* Login */
router.post('/login', userValidator.validate('loginUserVal'), userController.loginUser);

/* Below Routes are only accessibleafter Login */
router.use(authHelper.isAuthorize);

router.post('/upload-avatar', userController.checkImageVal, userController.uploadProfileAvatar);
router.put('/:id', userValidator.validate('editUserVal'), userController.editUser);
router.post('/change-password', userValidator.validate('changePassVal'), userController.changePass);

/* Logout */
router.get('/logout', userController.logoutUser);

module.exports      = router;