'use strict';

const path      = require('path');
let User        = require('../models/user.model'); 

let dbConn      = require(path.resolve('database.js'));

function absoluteId( id ) {
    if(id && id.charAt(0) != '/'){
        id = `/${id}`;
        return id;
    }
    return id;
}

module.exports = {
    getGroupST: async (groupid) => {
        groupid = absoluteId(groupid);
        let results = await User.getGroupST(groupid);
        return results[0].idst;
    },
    addToGroup: async (idst, idstMember, filter = '', oc) => {
        if((idst == 0) || (idstMember == 0)) return true;

		let add_list = (!isNaN(idstMember) ? [idstMember] : (Array.isArray(idstMember) ? idstMember : false));
		if (!Array.isArray(add_list)) return false;

        var values = [];
        for (let i = 0; i < add_list.length; i++) {
            let member = add_list[i];
            if(member > 0) values.push(`('${idst}', '${member}', '${filter}') `);
        }
        
        if(values.length > 0){
            return await User.addToGroup(...values);
        }
        return false;
    }
}