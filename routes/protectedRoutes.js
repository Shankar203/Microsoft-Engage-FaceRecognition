const router = require("express").Router();
const { isLoggedin } = require("../middlewares/userAuth.js");

router.get("/", isLoggedin, (req, res, next) => {
	res.status(200).json({ msg: "You can access the page" });
});

module.exports = router;
