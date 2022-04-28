const router = require("express").Router();

const userControllers = require("../controllers/userControllers.js");
const { imgHandle } = require("../middlewares/imgHandle.js");


router.post("/signup", imgHandle, userControllers.signup);
router.post("/login", imgHandle, userControllers.login);
router.get("/logout", userControllers.logout);

module.exports = router;
