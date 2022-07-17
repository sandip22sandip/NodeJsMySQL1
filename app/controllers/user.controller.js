'use strict';

let resHelper               = require('../helpers/response.helper.js');
let libUser                 = require('../lib/lib.user'); 
const bcrypt                = require('bcrypt');
const jwt                   = require('jsonwebtoken');
const { validationResult }  = require('express-validator/check');

let multer                  = require("multer");
const authHelper = require('../helpers/auth.helper.js');

function paginate(npp, page, totalRows){
    let numPerPage      = parseInt(npp, 10) || 10;
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

            let isReg = await libUser.registerUser(userid, firstname, lastname, email, pass, user_type);

            console.log(isReg.insertId);
            
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
            }, process.env.JWT_KEY);

            let updateAppToken = await libUser.updateAppToken(userData.idst, appToken);
            if(updateAppToken){
                resHelper.respondAsJSON(res, true, 200, "Logged in successfully!", userData);
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

                let updateUser = await libUser.updateUser(idst, userid, firstname, lastname, email, pass, user_type);
                resHelper.respondAsJSON(res, true, 200, "User details updated successfully!");
                return;
            }

            let updateUser = await libUser.updateUser(idst, userid, firstname, lastname, email, pass, user_type);
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

            let delUser = await libUser.deleteUser(idst);
            resHelper.respondAsJSON(res, true, 200, "User deleted successfully!", {delUser});
        }catch(error){
            resHelper.handleError(res);
            return;
        }
    },

    uploadProfileAvatar: async (req, res) => {
        try{
            let file    = req.file;
            // console.log(file);

            if(!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)){
                resHelper.handleError(res, false, 400, "Oops! File type not supported", {file});
                return;
            }

            var storage = multer.diskStorage({
                destination: function (req, file, cb) {
                  cb(null, './public/uploads/avatars/')
                },
                filename: function (req, file, cb) {
                  cb(null, file.originalname)
                }
            });
            var upload = multer({ storage: storage });

            if(upload){
                let appToken   = await authHelper.getAccessToken(req);
                if (appToken === null) {
                    resHelper.handleError(res, false, 401, 'UnAthorize access.', {});
                    return;
                }

                let userDetail = await libUser.getUserFromAppToken(appToken);
                if(userDetail.length == 0){
                    resHelper.handleError(res, false, 404, "Oops! User not found on the system.");
                    return;
                }

                let avatar  = 'public/uploads/avatars/'+file.filename;
                let idst    = userDetail[0].idst;
                let updateAvatar = await libUser.updateAvatar(idst, avatar);
                if(updateAvatar){
                    resHelper.respondAsJSON(res, true, 200, "Profile Avatar uploaded successfully!", {file});
                }else{
                    resHelper.handleError(res, false, 400, "Oops! Something went wrong while uploading the File.");
                }
            }else{
                resHelper.handleError(res, false, 400, "Oops! Something went wrong while uploading the File.");
            }
        }catch(error){
            resHelper.handleError(res);
        }
    }
}
