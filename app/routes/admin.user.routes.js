'user strict';

let express         = require('express');
let router          = express.Router();

let adminUserController     = require('../controllers/admin.user.controller.js');
let adminUserValidator      = require('../validators/admin.user.validator.js');
let authHelper              = require('../helpers/auth.helper.js');

router.use(authHelper.isAuthorize, authHelper.isAdmin);

router.delete('/:id', adminUserValidator.validate('deleteUserVal'), adminUserController.deleteUser);
router.get('/allusers', adminUserController.getAllUsers);

module.exports      = router;