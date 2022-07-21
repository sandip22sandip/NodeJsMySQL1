'use strict';

let dbConn      = require('../../database.js');

module.exports = {

    registerUser: (userid, firstname, lastname, email, pass, user_type) => {
        return new Promise((resolve, reject) => {
            let posts = { userid, firstname, lastname, email, pass, user_type };
            dbConn.query(`INSERT INTO ?? SET ?`, ["core_user", posts], (err, results) => {
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    },

    updateUser: (idst, userid, firstname, lastname, email, pass, user_type) => {
        return new Promise((resolve, reject) => {
            dbConn.query(`UPDATE ?? SET userid = ?, firstname = ?, lastname = ?, email = ?, pass = ?, user_type = ? WHERE idst = ?`, ["core_user", userid, firstname, lastname, email, pass, user_type, idst], (err, results) => {
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    },

    updateAppToken: (idst, appToken) => {
        return new Promise((resolve, reject) => {
            dbConn.query(`UPDATE ?? SET appToken = ? WHERE idst = ?`, ["core_user", appToken, idst], (err, results) => {
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    },

    updateAvatar: (idst, avatar) => {
        return new Promise((resolve, reject) => {
            dbConn.query(`UPDATE ?? SET avatar = ? WHERE idst = ?`, ["core_user", avatar, idst], (err, results) => {
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    },

    deleteUser: (idst) => {
        return new Promise((resolve, reject) => {
            dbConn.query(`DELETE FROM ?? WHERE idst = ?`, ["core_user", idst], (err, results) => {
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    }
}
