const bcrypt = require("bcrypt");
const { User } = require("../../models/userModel.js");
const { createToken } = require("../../middlewares/userAuth.js");


/**
 * User Controller, fires Asynchronously over /login route
 *
 * Check if User exists, and get the corresponding hashed password, now 
 * unhash it and compare, if they were similar send a cookie, else log
 * error to console setting status code to 400.
 *
 * @param {object} req Parsed json object received from Client
 * @param {object} res Parsed json object Set to the Client
 * @param {function} next function fired to move to next middleware
 * @returns {Promise} Response Object
 */
const login_f1 = async (req, res, next) => {
	try {
		// Check if User exists, email as an unique identifier, throw error if does'nt
		const user = await User.find({ email: req.body.email });
		if (user.length == 0) throw new Error("User Doesn't Exist");

		// Unhash hashed password, and compare, else throw error
		const pwdMatch = await bcrypt.compare(req.body.password, user[0].password);
		if (!pwdMatch) throw new Error("Incorrect Password, Try Again");

		// Create a Cookie, setting fac to 1 and append it to the Resonse Object
		const token = createToken({ _id: user[0]["_id"], fac: 1 }, "2h");
		res.cookie("engage_jwt", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
		res.status(200).json({ access: true, fac: 1, msg: "Login Successful" });
	} catch (err) {
		console.error(err);
		res.status(400).json({ access: false, fac: 1, msg: err.message });
	}
};

module.exports = { login_f1 };
