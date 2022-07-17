'user strict';

const multer        = require('multer');
let express         = require('express');
let router          = express.Router();

let userController  = require('../controllers/user.controller.js');
let userValidator   = require('../validators/user.validator.js');
let authHelper      = require('../helpers/auth.helper.js');

const upload = multer({ dest: './public/uploads/avatars/' });

router.post('/uploadAvatar', upload.single('image'), authHelper.isAuthorize, userController.uploadProfileAvatar);

router.post('/sign-up', userValidator.validate('signUpUserVal'), userController.signUpUser);
router.post('/login', userValidator.validate('loginUserVal'), userController.loginUser);
router.post('/:id', userValidator.validate('editUserVal'), authHelper.isAuthorize, userController.editUser);
router.delete('/:id', userValidator.validate('deleteUserVal'), authHelper.isAuthorize, userController.deleteUser);
router.get('/getusers', authHelper.isAuthorize, userController.getAllUsers);

module.exports      = router;