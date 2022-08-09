'use strict';

const bcrypt        = require('bcrypt');
const { resolve }   = require('path');
const path          = require('path');

let dbConn          = require(path.resolve('database.js'));

module.exports = {
    getAllUsers: (limit, sortBy, orderBy, filterBy) => {
        if(!sortBy){
            sortBy = 'idst';
        }

        if(!['ASC', 'DESC'].includes(orderBy)){
            orderBy = 'ASC';
        }
        return new Promise((resolve, reject) => {
            dbConn.query(`SELECT * FROM ?? WHERE idst != ? ORDER BY ${sortBy} ${orderBy}  LIMIT ${limit}`, ["core_user", "270"])
            .then(resolve)
            .catch(reject);
        });
    },
    getTotalUsersCount: () => {
        return new Promise((resolve, reject) => {
            dbConn.query(`SELECT COUNT(*) AS 'TotalUsers' FROM ?? WHERE idst != ?`, ["core_user", "270"])
            .then(resolve)
            .catch(reject);
        });
    },
    checkUseridExists: (userid) => {
        return new Promise((resolve, reject) => {
            dbConn.query( `SELECT * FROM ?? WHERE userid = ?`, ["core_user", userid])
            .then(resolve)
            .catch(reject);
        });
    },
    checkidstExists: (idst) => {
        return new Promise((resolve, reject) => {
            dbConn.query( `SELECT * FROM ?? WHERE idst = ?`, ["core_user", idst])
            .then(resolve)
            .catch(reject);
        });
    },
    getUserFromAppToken: (appToken) => {
        return new Promise((resolve, reject) => {
            dbConn.query(`SELECT * FROM ?? WHERE appToken = ?`, ["core_user", appToken])
            .then(resolve)
            .catch(reject);
        });
    },
    getUserLevelId: (idst) => {
        return new Promise((resolve, reject) => {
            dbConn.query(`SELECT idst FROM ?? WHERE idstMember = ? AND idst IN ('3', '4', '5', '6')`, ["core_group_members", idst])
            .then(resolve)
            .catch(reject);
        });
    }
}
