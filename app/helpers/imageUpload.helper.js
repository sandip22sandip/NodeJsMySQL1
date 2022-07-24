'use strict';

const multer    = require("multer");
const path      = require("path");

//storage is use for set destination and file name.
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads/avatars/');
    },
    filename: (req, file, callback) => {
        callback(null, new Date().getTime() + "-" + Math.round(Math.random()*100) +  path.extname(file.originalname));
    }
});

//here we check a file type.
//only upload png and jpeg file.
const fileFilter = (res, file, callback) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
        callback(null, true);
    } else {
        callback(null,false);
        return callback(new Error("Unsuported Files.(Please Upload Only Jpeg/png/jpg file, MaxSize 10Mb)."));
    }
};

//here we export upload method.
module.exports = {
    upload: multer({
        storage: storage,
        limits: {
        fileSize: 1024 * 1024 * 10, //it means it upload max 10 mb file.
        },
        fileFilter:fileFilter,
    })
}
