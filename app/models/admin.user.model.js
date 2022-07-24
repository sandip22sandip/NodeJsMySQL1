'use strict';

const path      = require('path');
let dbConn      = require(path.resolve('database.js'));

module.exports = {
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
