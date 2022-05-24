const router = require("express").Router();
const { isLoggedin } = require("../middlewares/userAuth.js");

router.post("/", isLoggedin, (req, res, next) => {
	res.status(200).json({ msg: "You can access the page" });
});

module.exports = router;
