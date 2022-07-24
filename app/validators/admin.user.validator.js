'use strict';

const { body, param } = require('express-validator/check');

exports.validate = (method) => {
    switch (method) {
        case 'deleteUserVal': {
            return [
                param('id').trim().escape().withMessage('User ID is required filed.')
            ];
        }
    }
}