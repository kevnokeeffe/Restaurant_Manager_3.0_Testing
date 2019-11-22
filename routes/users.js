let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const userController = require('../controllers/user-control');
let User = require('../models/users');
const VerifyToken = require('../auth/VerifyToken');

//This method registers a user
router.post('/register', userController.register);
//Access Area
router.get('/secret-route', (req, res, next) => {res.send('This is the secret content. Only logged in users can see that!');});
//Finds a user by their id
router.get('/:id/find', userController.findOne);
//This method prints out all the users
router.get('/all', userController.findAll);
//Deletes a single user of given id
router.delete('/:id/delete', userController.deleteUser);
// Updates A Single User in the Database
router.put('/:id/update', userController.updateUser);
//Sets one user to active
router.put('/:id/active', userController.setUserToActive);
//Sets one user to inactive
router.put('/:id/inactive', userController.setUserToInactive);
//Deletes all inactive users
router.delete('/delete', userController.deleteInactiveUsers);

module.exports = router;
