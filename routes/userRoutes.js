const router = require("express").Router();

/**
 * Import all RouteControllers form userControllers
 *
 * @constant {controller} signup Checks if account exists, and creates a account
 * @constant {controller} login Logs an user in, if account exists
 * @constant {controller} logout Deletes all cookies related to user
 * @constant {middleware} imgHandle middleware for extracting imgBolb to Uint8Array
 */
const { signup_f1 } = require("../controllers/factor1UserControllers/signupf1Controller.js");
const { login_f1 } = require("../controllers/factor1UserControllers/loginf1Controller.js");
const {getLogin_f2, postLogin_f2} = require("../controllers/factor2UserControllers/loginf2Controller.js")
const { login_f3 } = require("../controllers/factor3UserControllers/loginf3Controller.js");
const { logout } = require("../controllers/userControllers/logoutController.js");
const { imgHandle } = require("../middlewares/imgHandle.js");
const { isLoggedin } = require("../middlewares/userAuth.js");

router.post("/signup1", signup_f1);
router.post("/login1", login_f1);
router.get("/login2", isLoggedin, getLogin_f2);
router.post("/login2", isLoggedin, postLogin_f2);
router.post("/login3", isLoggedin, imgHandle, login_f3)
router.get("/logout", logout);
// router.post("/signup", imgHandle, signup);
// router.post("/login", imgHandle, login);

module.exports = router;
