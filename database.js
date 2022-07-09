'use strict';

let mysql   = require('mysql');
let util    = require('util');

let pool = mysql.createPool({
    connectionLimit: process.env.CONNLIMIT,
    host: process.env.DBHOST,
    user: process.env.DBROOT,
    password: process.env.DBPASS,
    database: process.env.DBNAME
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.log('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.log('Database connection was refused.');
        }
        if (connection) connection.release();
        return;
    }
});

pool.query = util.promisify(pool.query);

module.exports = pool;