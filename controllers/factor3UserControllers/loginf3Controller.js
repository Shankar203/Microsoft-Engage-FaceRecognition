const { User } = require("../../models/userModel.js");
const { createToken } = require("../../middlewares/userAuth.js");
const { compare, getFacialEmbeddings } = require("../../face_recognition/recognize.js");

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
const login_f3 = async (req, res, next) => {
	try {
		// Check if User trys to bypass prev authentication steps
		if (res.locals.user.fac < 2) throw new Error("Can't Skip factor2");

		// Check if facialEmbeddings exist, else a new one
		if (!res.locals.user._doc.facialEmbeddings.length) {
			// Generate Unified Facial Embeddings corresponding to the image buffer
			const userEbd = await getFacialEmbeddings(req.file.buffer);
			const userEbdArr = await userEbd.array();

			// Update corresponding document, with the generated facialEmbeddings
			await User.updateOne({ _id: res.locals.user._doc._id }, { facialEmbeddings: userEbdArr });
		} else {
			// Get FacialEmbeddings from the File Buffer, and Compare them with the one from DB
			const anchorEbd = res.locals.user._doc.facialEmbeddings;
			const similar = await compare(anchorEbd, req.file.buffer);
			if (!similar) throw new Error("Face Doesn't matched, Try Again");
		}

		// If Face matches, create a Cookie and append it to the Resonse Object
		const token = createToken({ _id: res.locals.user._doc._id, fac: 3 }, "2h");
		res.cookie("engage_jwt", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
		res.status(200).json({ access: true, fac: 3, msg: "Authentication Successful" });
	} catch (err) {
		console.error(err);
		res.status(400).json({ access: false, fac: 3, msg: err.message });
	}
};

module.exports = { login_f3 };
