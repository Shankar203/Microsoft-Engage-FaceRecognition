
/**
 * Controller, fires Asynchronously over /authorize route
 * 
 * Get the User stored from locals, and append the user info 
 * the Response Object
 * 
 * @param {object} req Parsed json object received from Client
 * @param {object} res Parsed json object Set to the Client
 * @param {function} next funtction fired to move to next middleware
 * @returns {Promise} Response Object
 */
const authorizeController = (req, res, next) => {
	const user = res.locals.user;
	res.status(200).json({ user, msg: "You can access the page" });
};

module.exports.authorizeController = authorizeController;
