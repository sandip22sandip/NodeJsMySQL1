'user strict';

let express         = require('express');
let router          = express.Router();

let adminUserController     = require('../controllers/admin.user.controller.js');
let adminUserValidator      = require('../validators/admin.user.validator.js');
let authHelper              = require('../helpers/auth.helper.js');

/* Below Routes only accessible by Logged In Admin Profile */
router.use(authHelper.isAuthorize, authHelper.isAdmin);

router.get('/allusers', adminUserController.getAllUsers);
router.delete('/:id', adminUserValidator.validate('deleteUserVal'), adminUserController.deleteUser);

module.exports      = router;