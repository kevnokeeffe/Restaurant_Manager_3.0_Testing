let Order = require ('../models/orders');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let message;
let User = require ('../models/users');
const bcrypt = require('bcrypt');

exports.addUser = (req, res, next) => {
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
                        error: err
                    });
                } else {
                    const user = new User({
                        //_id: mongoose.Schema.Types.ObjectID(),
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
                            res.status(201).json({
                                message: "User Created",
                                data: user
                            });
                        }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    });
};