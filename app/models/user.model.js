'use strict';

const path      = require('path');
let dbConn      = require(path.resolve('database.js'));

module.exports = {
    registerUser: (params) => {
        return new Promise((resolve, reject) => {
            dbConn.query(`INSERT INTO ?? SET ?`, ["core_user", params])
            .then(resolve)
            .catch(reject);
        });
    },
    updateUser: (params, idst) => {
        return new Promise((resolve, reject) => {
            dbConn.query(`UPDATE ?? SET ? WHERE idst = ?`, ["core_user", params, idst])
            .then(resolve)
            .catch(reject);
        });
    },
    updateAppToken: (idst, appToken) => {
        return new Promise((resolve, reject) => {
            dbConn.query(`UPDATE ?? SET appToken = ? WHERE idst = ?`, ["core_user", appToken, idst])
            .then(resolve)
            .catch(reject);
        });
    },
    updateAvatar: (idst, avatar) => {
        return new Promise((resolve, reject) => {
            dbConn.query(`UPDATE ?? SET avatar = ? WHERE idst = ?`, ["core_user", avatar, idst])
            .then(resolve)
            .catch(reject);
        });
    },
    updatePass: (idst, pass) => {
        return new Promise((resolve, reject) => {
            dbConn.query(`UPDATE ?? SET pass = ? WHERE idst = ?`, ["core_user", pass, idst])
            .then(resolve)
            .catch(reject);
        });
    }
}
