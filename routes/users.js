let express = require('express');
let router = express.Router();
const userController = require('../controllers/user-control');
let User = require('../models/users');

//This method adds a user
router.post('/add', userController.addUser);

//Finds a user by their id, just returns their name and email.
router.findOne = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  User.find({ "_id": req.params.id }, 'fName lName email active').then(id => {
    res.status(200).send(JSON.stringify(id, null, 5));
  }).catch(err => {
    //console.log(err);
    res.status(500).json({
      message: 'User NOT Found!',
      error: err
    });
  });
};

// router.userOrders = (req, res) => {
//   res.setHeader('Content-Type', 'application/json');
//   Order.find({ "userId": res.body.userId }).then(orders => {
//     //console.log(orders);
//     res.status(200).send(JSON.stringify(result, null, 5));;
//   }).catch(error => {
//     //console.log(error)
//   });
// };

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
router.deleteUser = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  User.deleteOne({ "_id": req.params.id }).exec().then(promis => {
    //console.log(promis);
    res.status(200).json({ message: "User deleted", promis: promis })

  }).catch(err => {
    //console.log(err);
    res.status(500).json({ message: "Error no such user", error: err });
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

router.addUsersOrders = ((req, res, next) => {
  //future method
});

module.exports = router;
