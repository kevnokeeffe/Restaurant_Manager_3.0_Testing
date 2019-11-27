let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
// Authentication methods

router.requireLogin = (req, res, next) => {
	const token = decodeToken(req);
	if (!token){
		return res.status(401).json({message: 'You must be logged in.'});
	}
	next();
};

router.generateJWT = (user) => {
	const tokenData = {fName: user.fName, id: user._id, email: user.email};

	return jwt.sign({ user: tokenData }, config.secret, {
		expiresIn: 86400 // expires in 24 hours
	});
};

router.decodeToken = (req) => {
	const token = req.headers.authorization || req.headers
		['authenticate'];
	if (!token){
		return null;
	}
	try {
		return jwt.verify(token, process.env.secret);
	} catch (error){
		return null;
	}
};

router.getEmail= (req) => {
	const token = decodeToken(req);
	if (!token){
		return null;
	}
	return token.user.email;
};

router.getName= (req) => {
	const token = decodeToken(req);
	if (!token){
		return null;
	}
	return token.user.fName;
};

router.getUserId = (req) => {
	const token = decodeToken(req);
	if (!token){
		return null;
	}
	return token.user.id;
};

module.exports = router;
