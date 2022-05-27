const router = require("express").Router();


/**
 * Send server-side confirmation to react-engine if user has Logged in
 * 
 * @constant {controller} authorizeController fires if user has Loggedin
 * @constant {middleware} isLoggedin middleware to check if user has Loggedin
 */
const { authorizeController } = require("../controllers/authorizeController.js");
const { isLoggedin } = require("../middlewares/userAuth.js");

router.get("/api/user/authorize", isLoggedin, authorizeController);

module.exports = router;
