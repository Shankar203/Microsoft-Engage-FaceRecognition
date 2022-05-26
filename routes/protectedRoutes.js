const router = require("express").Router();
const { isLoggedin } = require("../middlewares/userAuth.js");

router.get("/api/user/authorize", isLoggedin, (req, res, next) => {
	const user  = res.locals.user;
	res.status(200).json({ user, msg: "You can access the page" });
});

module.exports = router;
