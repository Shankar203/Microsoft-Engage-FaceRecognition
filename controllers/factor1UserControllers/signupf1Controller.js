const bcrypt = require("bcrypt");
const { User } = require("../../models/userModel.js");
const { createToken } = require("../../middlewares/userAuth.js");


/**
 * User Controller, fires Asynchronously over /signup route
 *
 * Check if User exists, and generate corresponding hashed password and
 * save the user credentials to the database, send a cookie, else log error to
 * console setting status code to 400.
 *
 * @param {object} req Parsed json object received from Client
 * @param {object} res Parsed json object Set to the Client
 * @param {function} next funtction fired to move to next middleware
 * @returns {Promise} Response Object
 */
const signup_f1 = async (req, res, next) => {
	try {
		// Check if User exists, using email as an unique identifier, throw error if exist
		const userExists = await User.exists({ email: req.body.email });
		if (userExists) throw new Error("User Already Exists");

		// Bcrypt hash password, with generated salt from 10 rounds
		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		// Create a new document, and add it the databse users collection
		const user = { email: req.body.email, name: req.body.name, password: hashedPassword };
		const u = await User.create(user);

		// If User created, create a Cookie and append it to the Resonse Object
		const token = createToken({ _id: u._id, fac: 1 }, "2h");
		res.cookie("engage_jwt", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
		res.status(200).json({ access: true, fac: 1, msg: "User Created Successfully" });
	} catch (err) {
		console.error(err);
		res.status(400).json({ access: false, fac: 1, msg: err.message });
	}
};

module.exports = {  signup_f1 };
