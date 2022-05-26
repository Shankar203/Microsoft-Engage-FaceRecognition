const { User } = require("../models/userModel.js");
const { createToken } = require("../middlewares/userAuth.js");
const { compare, getFacialEmbeddings } = require("../face_recognition/recognize.js");

const login = async (req, res, next) => {
	try {
		const user = await User.find({ email: req.body.email });
		if (user.length == 0) throw new Error("User Doesn't Exist");

		const anchorEbd = user[0]["facialEmbeddings"];
		const similar = await compare(anchorEbd, req.file.buffer);
		if (!similar) throw new Error("Face Doesn't matched, Try Again");

		const token = createToken(user[0]["_id"], "2h");
		res.cookie("engage_jwt", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
		res.status(200).json({ access: true, msg: "Login Successful" });
	} catch (err) {
		console.error(err);
		res.status(400).json({ access: false, msg: err.message });
	}
};

const signup = async (req, res, next) => {
	try {
		const userExists = await User.exists({ email: req.body.email });
		if (userExists) throw new Error("User Already Exists");

		const userEbd = await getFacialEmbeddings(req.file.buffer);
		const userEbdArr = await userEbd.array();

		const user = { email: req.body.email, name: req.body.name, facialEmbeddings: userEbdArr };
		const u = await User.create(user);

		const token = createToken(u._id, "2h");
		res.cookie("engage_jwt", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
		res.status(200).json({ access: true, msg: "User Created Successfully" });
	} catch (err) {
		console.error(err);
		res.status(400).json({ access: false, msg: err.message });
	}
};

const logout = (req, res, next) => {
	res.cookie("engage_jwt", "", { maxAge: 10 });
	res.status(200).json({ access: true, msg: "Logged Out Successfully" });
};

module.exports = { signup, login, logout };
