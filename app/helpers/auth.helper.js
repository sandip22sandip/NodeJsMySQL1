'use strict';

const jwt       = require('jsonwebtoken');
let resHelper   = require('./response.helper.js');
let libUser     = require('../lib/lib.user.js');

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
        // console.log("Access", tokenfromheader); 
        if (tokenfromheader === null) {
            resHelper.handleError(res, false, 401, 'UnAthorize access.', {});
            return;
        }
        let getUserData = await libUser.getUserFromAppToken(tokenfromheader);
        // console.log(getUserData);
        if(getUserData && getUserData.length){
            next();
        }else{
            resHelper.handleError(res, false, 401, 'UnAthorize access.', {});
            return;
        }
    }
};
