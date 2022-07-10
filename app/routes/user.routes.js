'user strict';

let express         = require('express');
let router          = express.Router();

let userController  = require('../controllers/user.controller.js');
let userValidator   = require('../validators/user.validator.js');
let authHelper      = require('../helpers/auth.helper.js');

router.post('/sign-up', userValidator.validate('signUpUserVal'), userController.signUpUser);
router.post('/login', userValidator.validate('loginUserVal'), userController.loginUser);
router.get('/getusers', authHelper.isAuthorize, userController.getAllUsers);

module.exports      = router;