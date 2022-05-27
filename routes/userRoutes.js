const router = require("express").Router();


/**
 * Import all RouteControllers form userControllers
 * 
 * @constant {controller} signup Checks if account exists, and creates a account
 * @constant {controller} login Logs an user in, if account exists
 * @constant {controller} logout Deletes all cookies related to user 
 * @constant {middleware} imgHandle middleware for extracting imgBolb to Uint8Array
 */
const { signup } = require("../controllers/userControllers/signupController.js");
const { login } = require("../controllers/userControllers/loginController.js");
const { logout } = require("../controllers/userControllers/logoutController.js");
const { imgHandle } = require("../middlewares/imgHandle.js");

router.post("/signup", imgHandle, signup);
router.post("/login", imgHandle, login);
router.get("/logout", logout);

module.exports = router;
