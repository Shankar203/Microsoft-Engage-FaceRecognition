const multer = require("multer");

const upload = multer({});

module.exports.imgHandle = upload.single("pic");
