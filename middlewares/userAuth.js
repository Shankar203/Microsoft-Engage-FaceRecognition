require("dotenv").config();
const jwt = require("jsonwebtoken");

const { User } = require("../models/userModel.js");

function createToken(_id, maxAge) {
	const token = jwt.sign({ _id }, "engage_jwt", { expiresIn: maxAge });
	return token;
}

const isLoggedin = async function (req, res, next) {
	try {
		const token = req.cookies.engage_jwt;
		if (!token) throw new Error("Please Login");

		const decodedToken = jwt.verify(token, "engage_jwt");
		const user = await User.findById(decodedToken._id);

		res.locals.user = { name: user.name, email: user.email, prevLogin: user.createdAt };
		next();
	} catch (err) {
		console.error(err);
		res.status(400).json({ access: false, msg: err.message });
	}
};

module.exports = { createToken, isLoggedin };
