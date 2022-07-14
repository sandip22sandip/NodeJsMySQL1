'use strict';

const bcrypt                = require('bcrypt');
let dbConn                  = require('../../database.js');

module.exports = {
    
    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            dbConn.query(`SELECT * FROM ?? WHERE idst != ?`, ["core_user", "270"], (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                } 
            });
        });
    },

    checkUseridExists: (userid) => {
        return new Promise((resolve, reject) => {
            dbConn.query( `SELECT * FROM ?? WHERE userid = ?`, ["core_user", userid],  (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                } 
            });
        });
    },

    checkidstExists: (idst) => {
        return new Promise((resolve, reject) => {
            dbConn.query( `SELECT * FROM ?? WHERE idst = ?`, ["core_user", idst],  (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                } 
            });
        });
    },

    registerUser: (userid, firstname, lastname, email, pass, user_type) => {
        return new Promise((resolve, reject) => {
            let qIUser = `INSERT INTO core_user (userid, firstname, lastname, email, pass, user_type) VALUES ('${userid}', '${firstname}', '${lastname}', '${email}', '${pass}', '${user_type}')`;
            dbConn.query(qIUser, (err, results) => {
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
            let qUpdateUser = `UPDATE core_user SET userid = '${userid}', firstname = '${firstname}', lastname = '${lastname}', email = '${email}', pass = '${pass}', user_type ='${user_type}' WHERE idst = '${idst}'`;
            dbConn.query(qUpdateUser, (err, results) => {
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
            let qDelUser = `DELETE FROM core_user WHERE idst = '${idst}'`;
            dbConn.query(qDelUser, (err, results) => {
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    }
}
