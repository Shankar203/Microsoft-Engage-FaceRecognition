require("dotenv").config();
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel.js");


/**
 * Synchronously sign the given payload into a JSON Web Token string payload
 * 
 * @param {string} _id Unique Identifer for the token
 * @param {time} maxAge Max life span of token in secs 
 * @returns {string} A JWT Signed Token
 */
function createToken(_id, maxAge) {
	const token = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: maxAge });
	return token;
}


/**
 * Asynchronously checks if user loggedin to browser, 
 * 
 * Check if cookie exists, and decode the cookie to verify jwt signature, 
 * and if user exists pass info to the next middleware, else log error 
 * to console setting status code to 400.
 */
const isLoggedin = async function (req, res, next) {
	try {
		// Get corresponding cookie, and throw error if does'nt exits
		const token = req.cookies.engage_jwt;
		if (!token) throw new Error("Please Login");

		// Verify cookie signature, and query db if user exists
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
		const user = await User.findById(decodedToken._id);

		// Save user info to locals, and move to next middleware
		res.locals.user = { name: user.name, email: user.email, prevLogin: user.createdAt };
		next();
	} catch (err) {
		console.error(err);
		res.status(400).json({ access: false, msg: err.message });
	}
};

module.exports = { createToken, isLoggedin };
