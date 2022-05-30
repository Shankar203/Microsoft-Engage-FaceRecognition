const cors = require("cors");


/**
 * Securely provide data transfer access to multipart/form-data, cookie-headers
 * 
 * @param {boolean} credentials Set to true, to send or receive cookie acccess across cross domain
 * @param {boolean} origin Set to true, to instantiate cross-site Access-Control to any domain
 */
module.exports = cors({ credentials: true, origin: true });
