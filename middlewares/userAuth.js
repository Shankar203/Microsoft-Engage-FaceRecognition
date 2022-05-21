require("dotenv").config();
const jwt = require("jsonwebtoken");

const { User } = require("../models/userModel.js");

function createToken(_id, maxAge) {
	const token = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: maxAge });
	return token;
}

const isLoggedin = async function (req, res, next) {
	try {
		const token = req.cookies.engage_jwt;
		if (!token) throw new Error("Please Login");

		const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
		const user = await User.findById(decodedToken._id);

		res.locals.user = user;
		next();
	} catch (err) {
		console.error(err);
		res.status(400).json(err);
	}
};

module.exports = { createToken, isLoggedin };