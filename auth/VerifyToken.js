const jwt = require('jsonwebtoken');
const config = require('../config');
let express = require('express');
let router = express.Router();

//Token verification
router.verifyToken = ((req, res, next) => {
	const token = req.headers.authorization || req.headers['authenticate'];
	if (!token)
		return res.status(403).send({ auth: false, message: 'No token provided.' });

	jwt.verify(token, config.secret, function(err, decoded) {
		if (err)
			return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

		// if everything good, save to request for use in other routes
		req.userId = decoded.id;
		next();
	});
});


module.exports = router;