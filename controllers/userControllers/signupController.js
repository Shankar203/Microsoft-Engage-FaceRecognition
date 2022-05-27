const { User } = require("../../models/userModel.js");
const { createToken } = require("../../middlewares/userAuth.js");
const { getFacialEmbeddings } = require("../../face_recognition/recognize.js");


/**
 * User Controller, fires Asynchronously over /signup route
 * 
 * Check if User exists, and generate corresponding embedding vector and
 * save the user credentials to the database send a cookie, else log error to 
 * console setting status code to 400.
 * 
 * @param {object} req Parsed json object received from Client
 * @param {object} res Parsed json object Set to the Client
 * @param {function} next funtction fired to move to next middleware
 * @returns {Promise} Response Object
 */
const signup = async (req, res, next) => {
	try {
		// Check if User exists, email as an unique identifier, throw error if exist
		const userExists = await User.exists({ email: req.body.email });
		if (userExists) throw new Error("User Already Exists");

		// Generate Unified Facial Embeddings corresponding to the image buffer
		const userEbd = await getFacialEmbeddings(req.file.buffer);
		const userEbdArr = await userEbd.array();

		// Create a new document, and add it the databse users collection
		const user = { email: req.body.email, name: req.body.name, facialEmbeddings: userEbdArr };
		const u = await User.create(user);

		// If User created, create a Cookie and append it to the Resonse Object
		const token = createToken(u._id, "2h");
		res.cookie("engage_jwt", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
		res.status(200).json({ access: true, msg: "User Created Successfully" });
	} catch (err) {
		console.error(err);
		res.status(400).json({ access: false, msg: err.message });
	}
};

module.exports.signup = signup;
