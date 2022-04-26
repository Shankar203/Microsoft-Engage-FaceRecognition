require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const morgan = require("morgan");

const { compare, compareImgs, getEmbeddings } = require("./face_recognition/recognize.js");
const { User } = require("./models/userModel.js");

const app = express();
const upload = multer({});
const PORT = process.env.PORT || 3080;

app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("Successful DB connection"))
	.catch((err) => console.error("DB connection fail"));

function createToken(_id, maxAge) {
	const token = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: maxAge });
	return token;
}

app.post("/api/signup", upload.single("pic"), async (req, res) => {
	try {
		const userExists = await User.exists({ email: req.body.email });
		if (userExists) throw new Error("User Already Exists");

		const userEbd = await getEmbeddings(req.file.buffer);
		const userEbdArr = await userEbd.array();

		const user = { email: req.body.email, name: req.body.name, facialEmbeddings: userEbdArr };
		const u = await User.create(user);

		const tok = createToken(u._id, "2h");
		res.cookie("engage_jwt", tok, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
		res.status(200).json({ msg: "User Created Successfully" });
	} catch (err) {
		console.error(err);
		res.status(400).json(err);
	}
});

app.get("/api", (req, res) => {
	const data = {
		username: "random name",
		age: -1,
	};
	res.status(200).json(data);
});

app.listen(3080, console.log("server started at port: " + PORT));
