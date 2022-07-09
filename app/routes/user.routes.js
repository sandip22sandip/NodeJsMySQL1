'user strict';

let express     = require('express');
let router      = express.Router();
let dbConn      = require('../../database.js');

router.get('/', function (req, res, next) {
    let sqlQuery = "SELECT * FROM core_user";

    let query = dbConn.query(sqlQuery, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
})

module.exports  = router;