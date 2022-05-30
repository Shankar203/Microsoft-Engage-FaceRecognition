const multer = require("multer");

const upload = multer({});


/**
 * When a web client uploads a file to a server, it is generally submitted through 
 * a form and encoded as multipart/form-data, imgHandle  is a bit of middleware that 
 * processes a single file associated with the given form field.
 */
module.exports.imgHandle = upload.single("pic");
