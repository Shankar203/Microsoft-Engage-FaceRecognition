const router = require("express").Router();

const { signup_f1 } = require("../controllers/factor1UserControllers/signupf1Controller.js");
const { login_f1 } = require("../controllers/factor1UserControllers/loginf1Controller.js");
const { getLogin_f2, postLogin_f2 } = require("../controllers/factor2UserControllers/loginf2Controller.js");
const { login_f3 } = require("../controllers/factor3UserControllers/loginf3Controller.js");
const { logout } = require("../controllers/userControllers/logoutController.js");
const { imgHandle } = require("../middlewares/imgHandle.js");
const { isLoggedin } = require("../middlewares/userAuth.js");


/**
 * userControllers corresponding to the post routes 
 *
 * @constant {controller} signup_f1 Grab email and password from the user, and Create a Account
 * @constant {controller} login_f1 Basic email password login validation 
 * @constant {controller} postLogin_f2 Collect generated tOTP, and verify it with tOTPSecret
 * @constant {middleware} imgHandle middleware for extracting imgBolb to Uint8Array
 * @constant {middleware} isLoggedin middleware to parse cookie and check if user loggedin
 */
router.post("/signup1", signup_f1);
router.post("/login1", login_f1);
router.post("/login2", isLoggedin, postLogin_f2);
router.post("/login3", isLoggedin, imgHandle, login_f3);


/**
 * userControllers corresponding to the get routes
 * 
 * @constant {controller} getLogin_f2 Check if user loggedin, and send generated tOTP_pathURL
 * @constant {controller} logout Deletes all cookies related to user, ending the session
 */
router.get("/login2", isLoggedin, getLogin_f2);
router.get("/logout", logout);

module.exports = router;
