'use strict';
const bcrypt                = require('bcrypt');
const { validationResult }  = require('express-validator/check');

let dbConn                  = require('../../database.js');
let authHelper              = require('../helpers/auth.helper.js');
let resHelper               = require('../helpers/response.helper.js');

let libUser                 = require('../lib/lib.user');       

module.exports = {
    getAllUsers: async (req, res) => {
        try{
            await dbConn.query("SELECT * FROM core_user", (err, results) => {
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

                let isExists    = await libUser.checkUseridExists(userid);
                if(isExists.length != 0){
                    resHelper.handleError(res, false, 400, "Oops! User already exists on System.", isExists[0]);
                }else{
                    let isReg = await libUser.registerUser(userid, firstname, lastname, email, pass, user_type);
                    console.log(isReg.insertId);
                    resHelper.respondAsJSON(res, true, 200, 'User registered successfully!', { idst: isReg.insertId});
                }
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

                let isExists    = await libUser.checkUseridExists(userid);
                if(isExists.length == 0){
                    resHelper.handleError(res, false, 401, "Oops! User does not exists on System.");
                }else{
                    const hashedPassword = isExists[0].pass;
                    if(bcrypt.compare(pass, hashedPassword)){
                        resHelper.respondAsJSON(res, true, 200, "Logged in successfully!", isExists[0]);
                    }else{
                        resHelper.handleError(res, false, 400, "Oops! Password does not matched.", {}); 
                    }
                }
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

                let results     = await libUser.checkidstExists(idst);

                if(results.length != 0){
                    if(userid !== results[0].userid){
                        let isExists    = await libUser.checkUseridExists(userid);
                        if(isExists.length != 0){
                            resHelper.handleError(res, true, 400, "Oops! Username already exists on the system.", isExists[0]);
                        }else{
                            let updateUser = await libUser.updateUser(idst, userid, firstname, lastname, email, pass, user_type);
                            resHelper.respondAsJSON(res, true, 200, "User details updated successfully!");
                        }
                    }else{
                        let updateUser = await libUser.updateUser(idst, userid, firstname, lastname, email, pass, user_type);
                        resHelper.respondAsJSON(res, true, 200, "User details updated successfully!", {updateUser});
                    }
                }else{
                    resHelper.handleError(res, true, 404, "Oops! User not found system.", {});
                }
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
                let idst        = req.params.id;
                let getUser     = await libUser.checkidstExists(idst);

                if(getUser.length == 0){
                    resHelper.handleError(res, false, 404, "Oops! User not found on the system.");
                }else{
                    dbConn.query(`DELETE FROM core_user WHERE idst = '${idst}'`, (err, results) => {
                        if(err) throw err;
                        resHelper.respondAsJSON(res, true, 200, "User deleted succssfully!", {});
                    });
                }
            }
        }catch(error){
            resHelper.handleError(res);
        }
    }
}