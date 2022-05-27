require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");


/**
 * Import Necessary Middleware and Routes
 * 
 * @file userRoutes all routes related to signup, login, logout,...
 * @file protectedRoutes all routes whose access requires acuthentication
 * @file corsHandle allows data transfer across cross-orgins
 */
const corsHandle = require("./middlewares/corsHandle.js");
const userRoutes = require("./routes/userRoutes.js");
const protectedRoutes = require("./routes/protectedRoutes.js");

const app = express();
const PORT = process.env.PORT || 3080;


/**
 * Bind application level middleware to app instance
 * 
 * @package cors to enable CORS across various origins
 * @package morgan HTTP request logger middleware
 * to recognize the incoming Request Object as strings or arrays
 * to parse incoming requests with JSON payloads
 * @package cookieParser parses cookies attached to the client request object
 * @package mongoSanitize sanitizes user-supplied data to prevent MongoDB Operator Injection
 */
app.use(corsHandle);
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());


// Connect to MongoDB (NoSQL-Database), and perform CRUD operations
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("Successful DB connection"))
	.catch((err) => console.error("DB connection failed"));


/** 
 * Handle all routes over "/api/user" by userRoutes, similarly "/" by protectedRoutes
 */
app.use("/", protectedRoutes);
app.use("/api/user", userRoutes);


/**
 * Host the whole app, connecting to port :3080
 * 
 * @constant PORT can be random port assigined by web-service, if 
 * it does'nt then connect to :3080
 */
app.listen(3080, console.log("server started at port: " + PORT));

module.exports = app;
