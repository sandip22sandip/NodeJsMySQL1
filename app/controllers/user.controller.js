'use strict';
const bcrypt                = require('bcrypt');
const { validationResult }  = require('express-validator/check');

let dbConn                  = require('../../database.js');
let authHelper              = require('../helpers/auth.helper.js');
let resHelper               = require('../helpers/response.helper.js');

module.exports = {
    getAllUsers: async (req, res) => {
        try{
            let sqlQuery = "SELECT * FROM core_user";
            let query = await dbConn.query(sqlQuery, (err, results) => {
                if(err) throw err;
                resHelper.respondAsJSON(res, true, 200, 'Users fetched successfully!', results);
            });
        } catch(error){
            resHelper.handleError(res);
        }
    },

    signUpUser: async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                resHelper.handleError(res, false, 400, 'Oops! Required Inputs are invalid.', { error: errors.array() });
            }else{
                let username    = req.body.username;
                let userid      = `/${username}`;
                let firstname   = req.body.firstname;
                let lastname    = req.body.lastname;
                let email       = req.body.email;
                let pass        = bcrypt.hashSync(req.body.password, 10);
                let user_type   = req.body.user_type;

                let qUserExists = `SELECT * FROM core_user WHERE userid = '${userid}'`;
                let rUserExists = await dbConn.query(qUserExists, (err, results) => {
                    if(err) throw err;
                    if(results.length != 0){
                        resHelper.handleError(res, false, 400, "Oops! User already exists on System.");
                    }else{
                        let qIUser = `INSERT INTO core_user (userid, firstname, lastname, email, pass, user_type) VALUES ('${userid}', '${firstname}', '${lastname}', '${email}', '${pass}', '${user_type}')`;

                        let rIUser = dbConn.query(qIUser, (err, results) => {
                            if(err) throw err;
                            console.log(results.insertId);
                            resHelper.respondAsJSON(res, true, 200, 'User registered successfully!', {});
                        });
                    }
                });
            }
        } catch(error){
            resHelper.handleError(res);
        }
    },

    loginUser: async (req, res, next) => {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                resHelper.handleError(res, false, 400, "Oops! The Login credentials are incorrect.", { error: errors.array() });
            }else{
                let username    = req.body.username;
                let userid      = `/${username}`;
                let pass        = req.body.pass;

                let qCUser = `SELECT * FROM core_user WHERE userid = '${userid}'`;
                let rCUser = await dbConn.query(qCUser, (err, results) => {
                    if(err) throw err;
                    if(results.length == 0){
                        resHelper.handleError(res, false, 401, "Oops! Username does not exists on the system.", {});                
                    }else{
                        const hashedPassword = results[0].pass;
                        if(bcrypt.compare(pass, hashedPassword)){
                            resHelper.respondAsJSON(res, true, 200, "Logged in successfully!", results[0]);
                        }else{
                            resHelper.handleError(res, false, 400, "Oops! Password does not matched.", {}); 
                        }
                    }
                });
            }
        }catch(error){
            resHelper.handleError(res);
        }
    },

    editUser: async (req, res) => {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                resHelper.handleError(res, false, 400, 'Oops! Required Inputs are invalid.', { error: errors.array() });
            }else{
                let idst        = req.params.id;
                let username    = req.body.username;
                let userid      = `/${username}`;
                let firstname   = req.body.firstname;
                let lastname    = req.body.lastname;
                let email       = req.body.email;
                let pass        = bcrypt.hashSync(req.body.password, 10);
                let user_type   = req.body.user_type;

                let qUserExists = `SELECT * FROM core_user WHERE idst = '${idst}'`;
                let rUserExists = await dbConn.query(qUserExists, (err, results) => {
                    if(err) throw err;
                    if(results.length != 0){
                        if(userid !== results[0].userid){
                            dbConn.query(`SELECT * FROM core_user WHERE userid = '${userid}'`, (err, getUser) => {
                                if(err) throw err;
                                if(getUser.length != 0){
                                    resHelper.handleError(res, true, 400, "Oops! Username already exists on the system.", getUser[0]);
                                }else{
                                    let qUpdateUser = `UPDATE core_user SET userid = '${userid}', firstname = '${firstname}', lastname = '${lastname}', email = '${email}', pass = '${pass}', user_type ='${user_type}' WHERE idst = '${idst}'`;
                                    let rUpdateUser = dbConn.query(qUpdateUser, (err, rowUpdateDetails) => {
                                        if(err) throw err;
                                        resHelper.respondAsJSON(res, true, 200, "User details updated successfully!");
                                    });
                                }
                            });
                        }else{
                            let qUpdateUser = `UPDATE core_user SET userid = '${userid}', firstname = '${firstname}', lastname = '${lastname}', email = '${email}', pass = '${pass}', user_type ='${user_type}' WHERE idst = '${idst}'`;
                            let rUpdateUser = dbConn.query(qUpdateUser, (err, rowUpdateDetails) => {
                                if(err) throw err;
                                resHelper.respondAsJSON(res, true, 200, "User details updated successfully!");
                            });
                        }
                    }else{
                        resHelper.handleError(res, true, 404, "Oops! User not found system.", {});
                    }
                });
            }
        } catch(error){
            resHelper.handleError(res);
        }
    },

    deleteUser: async (req, res) => {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                resHelper.handleError(res, false, 400, 'Oops! Required Inputs are invalid.', { error: errors.array() });
            }else{
                let idst = req.params.id;

                dbConn.query(`SELECT * FROM core_user WHERE idst = '${idst}'`, (err, getUser) => {
                    if(err) throw err;   
                    if(getUser.length == 0){
                        resHelper.handleError(res, false, 404, "Oops! User not found on the system.");
                    }else{
                        dbConn.query(`DELETE FROM core_user WHERE idst = '${idst}'`, (err, results) => {
                            if(err) throw err;
                            resHelper.respondAsJSON(res, true, 200, "User deleted succssfully!", {});
                        });
                    }             
                });
            }
        }catch(error){
            resHelper.handleError(res);
        }
    }
}