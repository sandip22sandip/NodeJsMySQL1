'use strict';

const { body, param } = require('express-validator/check');

exports.validate = (method) => {
    switch (method) {

        case 'signUpUserVal': {
            return [
                body('username').isLength({ min: 3 }, { max: 25 }).trim().escape().withMessage('Min 3 and Max 25 char required allowed in Username.'),
                body('password').isLength({ min: 3 }, { max: 25 }).trim().escape().withMessage('Min 3 and Max 25 char required allowed in Password.'),
                body('firstname').trim().escape().withMessage('Firstname is required.'),
                body('lastname').trim().escape().withMessage('Lastname is required.'),
                body('email').isEmail().normalizeEmail().withMessage('The E-Mail ID is invalid'),
                body('user_type').optional().isIn(["1", "2"]).withMessage('Only 1 & 2 User Types accepted.'),
            ];
        }

        case 'loginUserVal': {
            return [
                body('username').isLength({ min: 3 }, { max: 25 }).trim().escape().withMessage('Min 3 and Max 25 char required allowed in Username.'),
                body('pass').isLength({ min: 3 }, { max: 25 }).trim().escape().withMessage('Min 3 and Max 25 char required allowed in Password.'),
            ];
        }

        case 'editUserVal': {
            return [
                param('id').trim().escape().withMessage('User ID is required filed.'),
                body('username').isLength({ min: 3 }, { max: 25 }).trim().escape().withMessage('Min 3 and Max 25 char required allowed in Username.'),
                body('password').isLength({ min: 3 }, { max: 25 }).trim().escape().withMessage('Min 3 and Max 25 char required allowed in Password.'),
                body('firstname').trim().escape().withMessage('Firstname is required.'),
                body('lastname').trim().escape().withMessage('Lastname is required.'),
                body('email').isEmail().normalizeEmail().withMessage('The E-Mail ID is invalid'),
                body('user_type').optional().isIn(["1", "2"]).withMessage('Only 1 & 2 User Types accepted.'),
            ];
        }

        case 'deleteUserVal': {
            return [
                param('id').trim().escape().withMessage('User ID is required filed.')
            ];
        }
    }
}