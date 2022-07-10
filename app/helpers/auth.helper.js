'use strict';

const jwt       = require('jsonwebtoken');
let resHelper   = require('./response.helper.js');
let dbConn      = require('../../database.js');

/**
 * Get authorization token from header
 */
function getAccessTokenFromHeader(req) {
    return (req.headers['authorization'] && req.headers['authorization'] !== null ? req.headers['authorization'].split(' ')[1] : null);
}

module.exports = {
    /**
     * Get Token from Request Header
     */
    getAccessToken: (req) => {
        return getAccessTokenFromHeader(req);
    },
  
    verifyJWTToken: async (req, res, next) => {
        let tokenfromheader = getAccessTokenFromHeader(req);
        return jwt.verify(tokenfromheader, process.env.JWT_KEY);
    },

    isAuthorize: async (req, res, next) => {
        let tokenfromheader = getAccessTokenFromHeader(req);
        if (tokenfromheader === null) {
            resHelper.handleError(res, false, 401, 'UnAthorize access.', {});
        } else {
            let sqlQuery = `SELECT * FROM core_user WHERE idst = '${tokenfromheader}'`;

            let query = await dbConn.query(sqlQuery, (err, results) => {
                if(err) throw err;
                if(results && results.length){
                    // console.log(results);
                    next();
                }else{
                    resHelper.handleError(res, false, 401, 'UnAthorize access.', {});
                }
            });

            resHelper.handleError(res, false, 401, 'UnAthorize access.', {});
        }
    }
};
