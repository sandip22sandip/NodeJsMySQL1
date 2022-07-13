'use strict';

module.exports = {
   /**
   * Responds client with JSON response
   */
    respondAsJSON: (res, status = true, statusCode = 200, message = '', data = {}) => {
        res.status(statusCode).json({
            status,
            statusCode,
            message,
            data
        });
    },

    handleError: (res, status = false, statusCode = 400, message = '', data = {}) => {
        message = message || 'Internal server error';
        res.status(statusCode).send({
            status,
            statusCode,
            message,
            data
        });
        return;
    },
}