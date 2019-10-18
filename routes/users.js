let Users = require ('../models/users');
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


// try {
//     router.get('/',(req, res, next) => {
//         res.send('respond with a resource');
//     });
// } catch(err){ message = "Input is " + err;}


try{
  function getByValue(array,id) {
    const result = array.filter(function(obj){return obj.id == id;});
    return result?result[0]:null;
  }
}catch(err){message = "Input is " + err;}


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
  User.find({ "_id" : req.params.id },'fName lName email').then(id=>{
    res.send(JSON.stringify(id,null,5));
  }).catch(error => {
    console.log(error)
  });
};

router.findAll = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  User.find({},'fName lName email').then(id=>{
    res.send(JSON.stringify(id,null,5));
  }).catch(error => {
    console.log(error)
  });
};

router.deleteUser = (req,res) => {
  User.deleteOne({"_id": req.params._id}).then( promis =>{
    console.log(promis);
    res.json({messege:"User deleted",promis:promis})

  }).catch(error => {
    console.log(error)
  });
};

try{
  router.findID = (req,res) => {
    const user = getByValue(Users, req.params.fName);
    res.send(JSON.stringify(user,null,5));
    res.json(result);
  }
} catch (err){message = "Input is " + err;}



finally {
  module.exports = router;
}