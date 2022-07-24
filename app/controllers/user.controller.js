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

function paginate(npp, page, totalRows){
    let numPerPage      = parseInt(npp, 10) || process.env.DOCSLIMIT;
    let pageNo          = parseInt(page, 10) || 0;
    let skip            = pageNo * numPerPage;
    let limit           = skip + ',' + numPerPage;
    let numPages        = Math.ceil(totalRows[0].TotalUsers / numPerPage);

    let responsePayload = {
        limit: limit
    }

    if (pageNo < numPages) {
        responsePayload.pagination = {
            totalPage: numPages,
            current: pageNo,
            perPage: numPerPage,
            previous: pageNo > 0 ? pageNo - 1 : undefined,
            next: pageNo < (numPages-1) ? (parseInt(pageNo)+1) : undefined
        }
    } else if(totalRows[0].TotalUsers == 0){
        responsePayload.pagination = {
            err: 'No Records found!'
        }
    } else {
        responsePayload.pagination = {
            err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
        }
    }

    return responsePayload;
}

module.exports = {
    getAllUsers: async (req, res) => {
        try{
            let { npp, page, sortBy, orderBy}   = req.query;

            let totalRows       = await libUser.getTotalUsersCount();            let genPagi         = paginate(npp, page, totalRows);

            let limit           = genPagi.limit;
            let results         = await libUser.getAllUsers(limit, sortBy, orderBy);
            
            var responsePayload = {
                results: results,
                pagination: genPagi.pagination
            };

            resHelper.respondAsJSON(res, true, 200, 'Users fetched successfully!', responsePayload);
        } catch(error){
            resHelper.handleError(res);
            return;
        }
    },

    signUpUser: async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                resHelper.handleError(res, false, 400, 'Oops! Required Inputs are invalid.', { error: errors.array() });
                return;
            }

            let { username, password, firstname, lastname, email, user_type } = req.body;

            let pass        = bcrypt.hashSync(password, 10);
            let userid      = `/${username}`;

            let isExists    = await libUser.checkUseridExists(userid);
            if(isExists.length != 0){
                resHelper.handleError(res, false, 400, "Oops! User already exists on System.", isExists[0]);
                return;
            }

            let isReg = await User.registerUser(userid, firstname, lastname, email, pass, user_type);

            console.log("Registered User idst", isReg.insertId);
            
            resHelper.respondAsJSON(res, true, 200, 'User registered successfully!', { idst: isReg.insertId});
        } catch(error){
            resHelper.handleError(res);
            return;
        }
    },

    loginUser: async (req, res, next) => {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                resHelper.handleError(res, false, 400, "Oops! The Login credentials are incorrect.", { error: errors.array() });
                return;
            }

            let { username, pass } = req.body;
            let userid      = `/${username}`;
            let isExists    = await libUser.checkUseridExists(userid);
            if(isExists.length == 0){
                resHelper.handleError(res, false, 401, "Oops! User does not exists on System.");
                return;
            }

            const hashedPassword = isExists[0].pass;
            if(!bcrypt.compare(pass, hashedPassword)){
                resHelper.handleError(res, false, 400, "Oops! Password does not matched.", {});
                return;
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
                resHelper.handleError(res);
            }
        }catch(error){
            resHelper.handleError(res);
            return;
        }
    },

    editUser: async (req, res) => {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                resHelper.handleError(res, false, 400, 'Oops! Required Inputs are invalid.', { error: errors.array() });
                return;
            }

            let { username, password, firstname, lastname, email, user_type } = req.body;

            let idst        = req.params.id;
            let pass        = bcrypt.hashSync(password, 10);
            let userid      = `/${username}`;

            let results     = await libUser.checkidstExists(idst);

            if(results.length == 0){
                resHelper.handleError(res, true, 404, "Oops! User not found system.", {});
                return;
            }

            if(userid !== results[0].userid){
                let isExists    = await libUser.checkUseridExists(userid);
                if(isExists.length != 0){
                    resHelper.handleError(res, true, 400, "Oops! Username already exists on the system.", isExists[0]);
                    return;
                }

                let updateUser = await User.updateUser(idst, userid, firstname, lastname, email, pass, user_type);
                resHelper.respondAsJSON(res, true, 200, "User details updated successfully!");
                return;
            }

            let updateUser = await User.updateUser(idst, userid, firstname, lastname, email, pass, user_type);
            resHelper.respondAsJSON(res, true, 200, "User details updated successfully!", {updateUser});
        } catch(error){
            resHelper.handleError(res);
            return;
        }
    },

    deleteUser: async (req, res) => {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                resHelper.handleError(res, false, 400, 'Oops! Required Inputs are invalid.', { error: errors.array() });
                return;
            }

            let idst        = req.params.id;
            let getUser     = await libUser.checkidstExists(idst);

            if(getUser.length == 0){
                resHelper.handleError(res, false, 404, "Oops! User not found on the system.");
                return;
            }

            let delUser = await User.deleteUser(idst);
            resHelper.respondAsJSON(res, true, 200, "User deleted successfully!", {delUser});
        }catch(error){
            resHelper.handleError(res);
            return;
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
                resHelper.handleError(res, false, 404, "Oops! User not found on the system.");
                return;
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
