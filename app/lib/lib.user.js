'use strict';

const bcrypt                = require('bcrypt');
let dbConn                  = require('../../database.js');

module.exports = {
    checkUseridExists: (userid) => {
        return new Promise((resolve, reject) => {
            dbConn.query( `SELECT * FROM core_user WHERE userid = '${userid}'`, (err, results) => {
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
            dbConn.query( `SELECT * FROM core_user WHERE idst = '${idst}'`, (err, results) => {
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
    }
}