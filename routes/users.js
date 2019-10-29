let Order = require ('../models/orders');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let message;
let User = require ('../models/users');
const bcrypt = require('bcrypt');
message = "";

//Local connection
//mongoose.connect('mongodb://localhost:27017/restaurantManager', { useNewUrlParser: true });

//mLab Connection
const mongodbUri = "mongodb://dbKevin:akakok1984@ds241097.mlab.com:41097/heroku_q1g0hzrw";

//mongodb Atlas connection
//const mongodbUri = "mongodb+srv://dbKevin:KEV1984me@kevinscluster-cvmeg.mongodb.net/restaurantManager";

mongoose.connect(mongodbUri,{ useNewUrlParser: true });

let db = mongoose.connection;

db.on('error', function (err) {
  console.log('Unable to Connect to [ ' + db.name + ' ]'+ ' on users route', err);
});

db.once('open', function () {
  console.log('Successfully Connected to [ ' + db.name + ' ]'+ ' on users route');
});

//This method adds a user
router.addUser = ((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  // checks to see if the email already exists
  User.find({email: req.body.email}) .exec().then(user => {
    if (user.length >= 1) {
      //409 means conflict could use 422 which means unprocessable entity
      return res.status(409).json({message:"Sorry, email already exists!"});
    } else {
      //Hash password, adds salt 10 times.
      bcrypt.hash(req.body.password, 10, (err,hash)=>{
        if (err) {
          return res.status(500).json({
            error:err
          });
        } else {
          const user = new User({
            //_id: mongoose.Schema.Types.ObjectID(),
            fName : req.body.fName,
            lName : req.body.lName,
            email : req.body.email,
            password : hash,
            permission : req.body.permission,
            active : true
          });
          user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User Created",
                  data : user
                });
              }).catch(err => {
            console.log(err);
            res.status(500).json({
              error:err
            });
          });
        }
      });
    }
  });
  });

//Finds a user by their id, just returns their name and email.
router.findOne = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  User.find({ "_id" : req.params.id },'fName lName email active').then(id=>{
    res.send(JSON.stringify(id,null,5));
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error:err
  });
  });
};

router.userOrders = (req,res) => {
  res.setHeader('Content-Type', 'application/json');
  Order.find({"userId":res.body.userId}).then(orders=> {
    console.log(orders);
    res.status(200).send(JSON.stringify(result, null, 5));;
  }).catch(error => {
    console.log(error)
  });
};

//This method prints out all the users
router.findAll = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  User.find({},'fName lName email password active').then(id=>{
    res.send(JSON.stringify(id,null,5));
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error:err
  });
  });
};

//Deletes a single user of given id
router.deleteUser = (req,res,next) => {
  res.setHeader('Content-Type', 'application/json');
  User.deleteOne({"_id": req.params.id}).exec().then( promis =>{
    console.log(promis);
    res.status(200).json({messege:"User deleted",promis:promis})

  }).catch(err => {
    console.log(err);
    res.status(500).json({error:err});
  });
};


//Sets one user to active
router.setUserToActive = (req,res) => {
  res.setHeader('Content-Type', 'application/json');
  User.updateOne({"_id": req.params.id}, {$set: {active: true}}).then(promis => {
    res.json({messege: "Status changed to active", promis: promis})
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};

//Sets one user to inactive
router.setUserToInactive = (req,res) => {
  res.setHeader('Content-Type', 'application/json');
  User.updateOne({"_id":req.params.id},{$set:{active:false}}).then(promis=>{
    res.json({messege: "Status changed to inactive",promis:promis})
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error:err
  });
  });
};

//Deletes all inactive users
router.deleteInactiveUsers = (req,res) => {
  res.setHeader('Content-Type', 'application/json');
 User.deleteMany({ active:{$in:[false]}}).then( promis =>{
   res.json({messege: "Inactive users deleted",promis:promis})
 }).catch(err => {
   console.log(err);
   res.status(500).json({
     error:err
 });
 });
};

//Lists all orders of usersId
// router.usersOrders = (req,res,next) => {
//   res.setHeader('Content-Type', 'application/json');
//   Order.find({"userId": req.body.userId}).then(result => {
//     res.status(200).send(JSON.stringify(result, null, 5));
//   }).catch(err => {
//     console.log(err);
//     res.status(500).json({
//       error: err,
//       data: id
//     });
//   });
// };

router.addUsersOrders = ( (req,res,next) => {
  //future method
});

module.exports = router;
