const speakeasy = require("speakeasy");
const QRcode = require("qrcode");
const { User } = require("../../models/userModel.js");
const { createToken } = require("../../middlewares/userAuth.js");


/**
 * User Controller, fires Asynchronously over get req to /login2 route
 * 
 * Check the factor of authentication, now check if qr code has already been generated, if 
 * not generate a new totp_secret and store in the database else send the generated one, use 
 * qrcode todataurl to generate image corresponding to the totp_url.
 * 
 * @param {object} req Parsed json object received from Client
 * @param {object} res Parsed json object Set to the Client
 * @param {function} next function fired to move to next middleware
 * @returns {Promise} Response Object
 */
const getLogin_f2 = async (req, res, next) => {
	try {
		// Check if User trys to bypass prev authentication steps
		if (!res.locals.user.fac) throw new Error("Can't Skip factor1");

		// QR Code per user should be only generated once
		if (res.locals.user._doc.tOTPSecret) throw new Error("User has already paired with the QR Code");

		// Create temporary secret, and convert tOTPauthURL to dataURL
		const tOTPSecret = speakeasy.generateSecret();
		const tOTPauthURL = await QRcode.toDataURL(tOTPSecret.otpauth_url);

		// Append tOTPSecret to the database, which later be used to verify tOTP
		await User.updateOne({ _id: res.locals.user._doc._id }, { tOTPSecret: tOTPSecret.base32 });
		res.status(200).json({ access: true, fac: 2, tOTPauthURL });
	} catch (err) {
		console.error(err);
		res.status(400).json({ access: false, fac: 2, msg: err.message });
	}
};


/**
 * User Controller, fires Asynchronously over post req to /login2 route
 * 
 * Check the factor of authentication, get totp_secret from database and compare 
 * that with totp from client using speakeasy totp verify, if verified update the 
 * cookie and append it to response.
 * 
 * @param {object} req Parsed json object received from Client
 * @param {object} res Parsed json object Set to the Client
 * @param {function} next function fired to move to next middleware
 * @returns {Promise} Response Object
 */
const postLogin_f2 = async (req, res, next) => {
	try {
		// Check if User trys to bypass prev authentication steps
		if (!res.locals.user.fac) throw new Error("Can't Skip factor1");

		// Verify the tOTP from the res, through tOTPSecret
		const tOTPVerified = speakeasy.totp.verify({
			secret: res.locals.user._doc.tOTPSecret,
			encoding: "base32",
			token: req.body.tOTP,
			window: 1,
		});
		if (!tOTPVerified) throw new Error("OTP Timed Out");

		// Create a Cookie, setting fac to 1 and append it to the Resonse Object
		const token = createToken({ _id: res.locals.user._doc._id, fac: 2 }, "2h");
		res.cookie("engage_jwt", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
		res.status(200).json({ access: true, fac: 2, msg: "Authentication Successful" });
	} catch (err) {
		console.error(err);
		res.status(400).json({ access: false, fac: 2, msg: err.message });
	}
};

module.exports = { getLogin_f2, postLogin_f2 };
