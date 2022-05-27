
/**
 * User Controller, fires Asynchronously over /logout route
 * 
 * A Cookie can't be deleted, So it's lifespan is set to a very small value 
 * so that it expires in a very short time
 * 
 * @param {object} req Parsed json object received from Client
 * @param {object} res Parsed json object Set to the Client
 * @param {function} next funtction fired to move to next middleware
 * @returns {Promise} Response Object
 */
const logout = (req, res, next) => {
	res.cookie("engage_jwt", "", { maxAge: 10 });
	res.status(200).json({ access: true, msg: "Logged Out Successfully" });
};

module.exports.logout = logout;
