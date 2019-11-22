let express = require('express');
let router = express.Router();
let User = require ('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const VerifyToken = require('../auth/VerifyToken');

// Register the User
router.register = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');

    // checks to see if the email already exists
    User.find({email: req.body.email}).exec().then(user => {
        if (user.length >= 1) {
            //409 means conflict could use 422 which means unprocessable entity
            return res.status(409).json({message: "Sorry, email already exists!"});
        } else {
            //Hash password, adds salt 10 times.
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        message: "Error Invalid Inputs",error: err
                    });
                } else {
                    const user = new User({
                        fName: req.body.fName,
                        lName: req.body.lName,
                        email: req.body.email,
                        password: hash,
                        permission: req.body.permission,
                        active: true
                    });
                    user
                        .save()
                        .then(result => {
                            //console.log(result);
                            // This is where i added the token code
                            const token = jwt.sign({ id: user._id }, config.secret, {
                                expiresIn: 86400 // expires in 24 hours
                            });
                            res.status(200).send({ auth: true, token: token, message: "User Created" });
                        }).catch(err => {

                        res.status(500).json({message:"Error Invalid Inputs",
                            error: err
                        });
                    });
                }
            });
        }
    });
};

router.findOne = (VerifyToken,(req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({auth: false, message: 'No token provided.'});

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});

        User.findById(decoded.id,
            {password: 0}, // projection, does not return the user password
            function (err, user) {
                if (err) return res.status(500).send("There was a problem finding the user.");
                if (!user) return res.status(404).send("No user found.");

                res.status(200).send(user);

            })
        // User.find({ "_id": req.params.id }, 'fName lName email active').then(id => {
        //   res.status(200).send(JSON.stringify(id, null, 5));
        // })
            .catch(err => {
                //console.log(err);
                res.status(500).json({
                    message: 'User NOT Found!',
                    error: err
                });
            });
    });
});

module.exports = router;