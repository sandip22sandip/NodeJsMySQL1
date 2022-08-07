'use strict';

const jwt       = require('jsonwebtoken');
let resHelper   = require('./response.helper.js');
let libUser     = require('../lib/lib.user.js');

/* Get authorization token from header */
function getAccessTokenFromHeader(req) {
    return (req.headers['authorization'] && req.headers['authorization'] !== null ? req.headers['authorization'].split(' ')[1] : null);
}

module.exports = {
    /* Fetch Access Token */
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
            return resHelper.handleError(res, false, 401, 'UnAthorize access.', {});
        }
        let getUserData = await libUser.getUserFromAppToken(tokenfromheader);
        // console.log(getUserData);
        if(getUserData && getUserData.length){
            next();
        }else{
            return resHelper.handleError(res, false, 401, 'UnAthorize access.', {});
        }
    },

    isAdmin: async (req, res, next) => {
        let tokenfromheader = getAccessTokenFromHeader(req);
        // console.log("Access", tokenfromheader); 
        if (tokenfromheader === null) {
            return resHelper.handleError(res, false, 401, 'UnAthorize access.', {});
        }
        let getUserData = await libUser.getUserFromAppToken(tokenfromheader);
        // console.log(getUserData);
        if(getUserData && getUserData.length){
            if(getUserData[0].user_type == '1'){
                next();
            }else{
                return resHelper.handleError(res, false, 401, `You can't Access`, {});
            }
        }else{
            return resHelper.handleError(res, false, 401, 'UnAthorize access.', {});
        }
    }
};
