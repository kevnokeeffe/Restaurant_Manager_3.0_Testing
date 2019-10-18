let Users = require ('../models/users');
let Backup = require ('../models/backup');
let express = require('express');
let router = express.Router();
let os = require("os");
let mongoose = require('mongoose');
let message
let User = require ('../models/users');
message = "";

mongoose.connect('mongodb://localhost:27017/restaurantManager', { useNewUrlParser: true });
let db = mongoose.connection;

db.on('error', function (err) {
  console.log('Unable to Connect to [ ' + db.name + ' ]'+ ' on users route', err);
});

db.once('open', function () {
  console.log('Successfully Connected to [ ' + db.name + ' ]'+ ' on users route');
});

//This method adds a user
router.addUser = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  let user = new User();
     user.fName = req.body.fName;
     user.lName = req.body.lName;
     user.email = req.body.email;
     user.password = req.body.password;
     user.permission = req.body.permission;
     user.active = true;
  user.save(function(err) {
    if (err)
      res.json({ message: 'User not Added!', errmsg : err } );
    else
      res.json({ message: 'User Successfully Added!', data: user });
  });
};

//Finds a user by their id, just returns their name and email, nothing else.
router.findOne = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  User.find({ "_id" : req.params.id },'fName lName email active').then(id=>{
    res.send(JSON.stringify(id,null,5));
  }).catch(error => {
    console.log(error)
  });
};

//This method prints out all the users
router.findAll = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  User.find({},'fName lName email').then(id=>{
    res.send(JSON.stringify(id,null,5));
  }).catch(error => {
    console.log(error)
  });
};

//Deletes a single user of given id
router.deleteUser = (req,res) => {
  User.deleteOne({"_id": req.params._id}).then( promis =>{
    console.log(promis);
    res.json({messege:"User deleted",promis:promis})

  }).catch(error => {
    console.log(error)
  });
};

//Sets one user to active
router.setUserToActive = (req,res) => {
  User.updateOne({"_id":req.params.id},{$set:{active:true}}).then(promis=>{
    res.json({messege:"Status changed to inactive",promis:promis})
  }).catch(error => {
    console.log(error)
  });
};

//Sets one user to inactive
router.setUserToInactive = (req,res) => {
  User.updateOne({"_id":req.params.id},{$set:{active:false}}).then(promis=>{
    res.json({messege:"Status changed to inactive",promis:promis})
  }).catch(error => {
    console.log(error)
  });
};

//Deletes all inactive users
router.deleteInactiveUsers = (req,res) => {
 User.deleteMany({ active:{$in:[false]}}).then( promis =>{
   res.json({messege:"Inactive users deleted",promis:promis})
 }).catch(error => {
   console.log(error)
 });
};


module.exports = router;
