'use strict';

const bcrypt    = require('bcrypt');
const path      = require('path');

let dbConn      = require(path.resolve('database.js'));

module.exports = {
    
    getAllUsers: (limit, sortBy, orderBy, filterBy) => {
        if(!sortBy){
            sortBy = 'idst';
        }

        if(!['ASC', 'DESC'].includes(orderBy)){
            orderBy = 'ASC';
        }
        return new Promise((resolve, reject) => {
            dbConn.query(`SELECT * FROM ?? WHERE idst != ? ORDER BY ${sortBy} ${orderBy}  LIMIT ${limit}`, ["core_user", "270"], (err, results) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                } 
            });
        });
    },

    getTotalUsersCount: () => {
        return new Promise((resolve, reject) => {
            dbConn.query(`SELECT COUNT(*) AS 'TotalUsers' FROM ?? WHERE idst != ?`, ["core_user", "270"], (err, results) => {
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

    getUserFromAppToken: (appToken) => {
        return new Promise((resolve, reject) => {
            dbConn.query(`SELECT * FROM ?? WHERE appToken = ?`, ["core_user", appToken], (err, results) => {
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
    }
}
