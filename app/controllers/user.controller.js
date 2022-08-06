'use strict';

const authHelper            = require('../helpers/auth.helper.js');
let resHelper               = require('../helpers/response.helper.js');
let imageUploader           = require('../helpers/imageUpload.helper.js');
let libUser                 = require('../lib/lib.user'); 
let User                    = require('../models/user.model'); 

let fs                      = require('fs');
const bcrypt                = require('bcrypt');
const jwt                   = require('jsonwebtoken');
const { validationResult }  = require('express-validator/check');

const uploadImage           = imageUploader.upload.single('image');

module.exports = {
    signUpUser: async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return resHelper.handleError(res, false, 400, 'Oops! Required Inputs are invalid.', { error: errors.array() });
            }

            let { username, password, firstname, lastname, email, user_type } = req.body;

            let pass        = bcrypt.hashSync(password, 10);
            let userid      = `/${username}`;

            let isExists    = await libUser.checkUseridExists(userid);
            if(isExists.length != 0){
                return resHelper.handleError(res, false, 400, "Oops! User already exists on System.", isExists[0]);
            }

            const RegParams = { userid, firstname, lastname, email, pass, user_type };

            let isReg = await User.registerUser(RegParams);

            console.log("Registered User idst", isReg.insertId);
            
            resHelper.respondAsJSON(res, true, 200, 'User registered successfully!', { idst: isReg.insertId});
        } catch(error){
            return resHelper.handleError(res);
        }
    },
    loginUser: async (req, res, next) => {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return resHelper.handleError(res, false, 400, "Oops! The Login credentials are incorrect.", { error: errors.array() });
            }

            let { username, pass } = req.body;
            let userid      = `/${username}`;
            let isExists    = await libUser.checkUseridExists(userid);
            if(isExists.length == 0){
                return resHelper.handleError(res, false, 401, "Oops! User does not exists on System.");
            }

            const hashedPassword = isExists[0].pass;
            if(!bcrypt.compare(pass, hashedPassword)){
                return resHelper.handleError(res, false, 400, "Oops! Password does not matched.", {});
            }

            let userData = isExists[0];
            let appToken = jwt.sign({
                idst: userData.idst,
                userid: userData.userid, 
                firstname: userData.firstname, 
                lastname: userData.lastname, 
                email: userData.email,
                user_type: userData.user_type
            }, process.env.JWT_KEY, { expiresIn: '2h' });

            let updateAppToken = await User.updateAppToken(userData.idst, appToken);
            if(updateAppToken){
                resHelper.respondAsJSON(res, true, 200, "Logged in successfully!", appToken);
            }else{
                return resHelper.handleError(res);
            }
        }catch(error){
            return resHelper.handleError(res);
        }
    },
    logoutUser: async (req, res) => {
        try{
            const userDetails = await authHelper.verifyJWTToken(req);
            
            /* UPDATE Token to NULL */
            await User.updateAppToken(userDetails.idst, null);
            return resHelper.respondAsJSON(res, true, 200, "User logged out successfully!");
        }catch(error){
            return resHelper.handleError(res);
        }
    },
    editUser: async (req, res) => {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return resHelper.handleError(res, false, 400, 'Oops! Required Inputs are invalid.', { error: errors.array() });
            }

            let { username, password, firstname, lastname, email, user_type } = req.body;

            let idst        = req.params.id;
            let pass        = bcrypt.hashSync(password, 10);
            let userid      = `/${username}`;

            let results     = await libUser.checkidstExists(idst);

            if(results.length == 0){
                return resHelper.handleError(res, true, 404, "Oops! User not found system.", {});
            }

            if(userid !== results[0].userid){
                let isExists    = await libUser.checkUseridExists(userid);
                if(isExists.length != 0){
                    return resHelper.handleError(res, true, 400, "Oops! Username already exists on the system.", isExists[0]);
                }

                let upParams   = {userid, firstname, lastname, email, pass, user_type };
                let updateUser = await User.updateUser(upParams, idst);
                return resHelper.respondAsJSON(res, true, 200, "User details updated successfully!", {updateUser});
            }

            let updateUser = await User.updateUser(idst, userid, firstname, lastname, email, pass, user_type);
            resHelper.respondAsJSON(res, true, 200, "User details updated successfully!", {updateUser});
        } catch(error){
            return resHelper.handleError(res);
        }
    },
    checkImageVal: async (req, res, next)=>{
        uploadImage(req, res, (err)=>{
            if(err){
                return resHelper.handleError(res, false, 400, 'Oops! Bad request.', err.message);
            }
            next();
        });
    },
    uploadProfileAvatar: async (req, res) => {
        try{
            let file    = req.file;
            // console.log(file);

            let userDetail = await authHelper.verifyJWTToken(req);

            if(Object.keys(userDetail).length === 0 && userDetail.constructor === Object){
                return resHelper.handleError(res, false, 404, "Oops! User not found on the system.");
            }

            //Unlink previously uploaded Avatar:-
            let getUserFromToken = await libUser.checkidstExists(userDetail.idst);
            if(getUserFromToken[0].avatar && getUserFromToken[0].avatar !== null){
                await fs.unlinkSync(`./${getUserFromToken[0].avatar}`);
            }

            let avatar          = `public/uploads/avatars/${file.filename}`;
            let idst            = userDetail.idst;
            let updateAvatar    = await User.updateAvatar(idst, avatar);
            if(updateAvatar){
                resHelper.respondAsJSON(res, true, 200, "Profile Avatar uploaded successfully!", {file});
            }else{
                resHelper.handleError(res, false, 400, "Oops! Something went wrong while uploading the File.");
            }

        }catch(error){
            resHelper.handleError(res);
        }
    }
}
