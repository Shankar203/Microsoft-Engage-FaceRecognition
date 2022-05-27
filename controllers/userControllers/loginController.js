const bcrypt = require("bcrypt");
const { User } = require("../../models/userModel.js");
const { createToken } = require("../../middlewares/userAuth.js");
const { compare } = require("../../face_recognition/recognize.js");

/**
 * User Controller, fires Asynchronously over /login route
 *
 * Check if User exists, and get the corresponding embedding vector now compare them
 * with the generated embeddings, if similarity is greater than a threshold, send a cookie
 * else log error to console setting status code to 400.
 *
 * @param {object} req Parsed json object received from Client
 * @param {object} res Parsed json object Set to the Client
 * @param {function} next function fired to move to next middleware
 * @returns {Promise} Response Object
 */
const login = async (req, res, next) => {
	try {
		// Check if User exists, email as an unique identifier, throw error if does'nt
		const user = await User.find({ email: req.body.email });
		if (user.length == 0) throw new Error("User Doesn't Exist");

		// Get FacialEmbeddings from the File Buffer, and Compare them with the one from DB
		const anchorEbd = user[0]["facialEmbeddings"];
		const similar = await compare(anchorEbd, req.file.buffer);
		if (!similar) throw new Error("Face Doesn't matched, Try Again");

		// If Face matches, create a Cookie and append it to the Resonse Object
		const token = createToken(user[0]["_id"], "2h");
		res.cookie("engage_jwt", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
		res.status(200).json({ access: true, msg: "Login Successful" });
	} catch (err) {
		console.error(err);
		res.status(400).json({ access: false, msg: err.message });
	}
};

module.exports = { login };
