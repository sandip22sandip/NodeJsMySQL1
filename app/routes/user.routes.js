'user strict';

let express         = require('express');
let router          = express.Router();

let userController  = require('../controllers/user.controller.js');
let authHelper      = require('../helpers/auth.helper.js');

router.post('/sign-up', userController.signUpUser);
router.post('/login', userController.loginUser);
router.get('/getusers', authHelper.isAuthorize, userController.getAllUsers);

module.exports      = router;