const mongoose = require("mongoose");


/**
 * Basic Schema for storing User Credentials
 * 
 * @param email user email, used as an unique identifier
 * @param name name of the user who wants to register
 * @param facialEmbeddings unique representation of an image
 * @param createdAt user last modified
 */
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
	},
	name: {
		type: String,
		required: true,
	},
	facialEmbeddings: {
		type: Array,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports.User = mongoose.model("user", userSchema);
