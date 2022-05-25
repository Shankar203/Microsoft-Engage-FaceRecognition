require("dotenv").config();
const cors = require('cors');
const express = require("express");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3080;

app.use(cors());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, "client", "build")));


mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("Successful DB connection"))
	.catch((err) => console.error("DB connection failed"));

const userRoutes = require("./routes/userRoutes.js");
const protectedRoutes = require("./routes/protectedRoutes.js");

app.use("/", protectedRoutes);
app.use("/api/user", userRoutes);
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(3080, console.log("server started at port: " + PORT));
