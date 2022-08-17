'use strict';

const path          = require('path');
let dbConn          = require(path.resolve('database.js'));

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
    },
    getGroupST: (groupid) => {
        return new Promise((resolve, reject) => {
            dbConn.query(`SELECT idst FROM ?? WHERE groupid = ?`, ["core_group", groupid])
            .then(resolve)
            .catch(reject);
        });    
    },
    addToGroup: (...values) => {
        return new Promise((resolve, reject) => {
            //return console.log(`INSERT INTO core_group_members (idst, idstMember, filter) VALUES ${values.join(', ')}`);
            dbConn.query(`INSERT INTO core_group_members (idst, idstMember, filter) VALUES ${values.join(', ')}`)
            .then(resolve)
            .catch(reject);
       });
    }
}
