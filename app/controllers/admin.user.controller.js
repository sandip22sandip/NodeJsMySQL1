'use strict';

let resHelper               = require('../helpers/response.helper.js');
let libUser                 = require('../lib/lib.user'); 
let Admin                   = require('../models/admin.user.model'); 

const { validationResult }  = require('express-validator/check');

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
            return resHelper.handleError(res);
        }
    },

    deleteUser: async (req, res) => {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return resHelper.handleError(res, false, 400, 'Oops! Required Inputs are invalid.', { error: errors.array() });
            }

            let idst        = req.params.id;
            let getUser     = await libUser.checkidstExists(idst);

            if(getUser.length == 0){
                return resHelper.handleError(res, false, 404, "Oops! User not found on the system.");
            }

            let delUser = await Admin.deleteUser(idst);
            resHelper.respondAsJSON(res, true, 200, "User deleted successfully!", {delUser});
        }catch(error){
            return resHelper.handleError(res);
        }
    },
}
