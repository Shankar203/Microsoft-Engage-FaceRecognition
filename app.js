require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer")
const morgan = require("morgan");

const app = express();
const upload = multer({});
const PORT = process.env.PORT || 3080;

app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

function createToken(_id, maxAge) {
	const token = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: maxAge });
	return token;
}

app.post("/api/signup", upload.single('pic'), async (req, res) => {
	try {
		const encoded = req.file.buffer.toJSON()
		console.log(encoded);
		res.json({msg: 'done'})
	} catch (err) {
		console.error(err);
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
