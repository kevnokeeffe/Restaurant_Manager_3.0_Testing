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

// Login a user
router.login = (req, res) => {
    const { email} = req.body;
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).send({message: "User not found"});
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then(match => {
                    if (!match) {
                        return res.status(401).send({ auth: false, token: null });
                    }
                    const token = jwt.sign({ id: user._id }, config.secret, {
                                expiresIn: 86400 // expires in 24 hours
                            });
                    res.status(200).send({ message: "Login Successful", auth: true, token: token });
                })

     });

};

// Log Out function. Sets token to null making it invalid.
router.logout = (req, res) => {
    res.status(200).send({ auth: false, token: null });
};

// Find one User

router.findOne = (VerifyToken,(req, res, next) => {
    const token = req.headers.authorization || req.headers['authenticate'];
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

//This method prints out all the users
router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    User.find({}, 'fName lName email active').then(id => {
        res.send(JSON.stringify(id, null, 5));
    }).catch(err => {
        //console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

//Deletes a single user of given id
router.deleteUser = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    User.deleteOne({ "_id": req.params.id }).exec().then(promis => {
        //console.log(promis);
        res.status(200).json({ message: "User deleted", promis: promis })

    }).catch(err => {
        //console.log(err);
        res.status(500).json({ message: "Error no such user", error: err });
    });
};

// Updates A Single User in the Database
router.updateUser = (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
};

//Sets one user to active
router.setUserToActive = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    User.updateOne({ "_id": req.params.id }, { $set: { active: true } }).then(promis => {
        res.json({ message: "Status changed to active", promis: promis })
    }).catch(err => {
        //console.log(err);
        res.status(500).json({
            message: "Error no such user"
        });
    });
};

//Sets one user to inactive
router.setUserToInactive = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    User.updateOne({ "_id": req.params.id }, { $set: { active: false } }).then(promis => {
        res.json({ message: "Status changed to inactive", promis: promis })
    }).catch(err => {
        //console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

//Deletes all inactive users
router.deleteInactiveUsers = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    User.deleteMany({ active: { $in: [false] } }).then(promis => {
        res.json({ messege: "Inactive users deleted", promis: promis })
    }).catch(err => {
        //console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

// Verify that the user is logged in
router.verify = (VerifyToken, function(req, res, next) {
    const token = req.headers.authorization || req.headers['authenticate'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        User.findById(decoded.id,
            { password: 0 }, // protection, does not return the user password
            function (err, user) {
                if (err) return res.status(500).send("There was a problem finding the user.");
                if (!user) return res.status(404).send("No user found.");

                res.status(200).send(user);

            });
    });
});

router.addUsersOrders = ((req, res, next) => {
    //future method
});

module.exports = router;