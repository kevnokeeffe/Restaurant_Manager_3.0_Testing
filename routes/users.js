let express = require('express');
let router = express.Router();
const userController = require('../controllers/user-control');


// This method registers a user
router.post('/register', userController.register);
// Login
router.post('/login', userController.login);
//LogOut
router.get('/logout', userController.verify, userController.logout);
// Access Area
router.get('/secret-route', userController.verify, (req, res) => {res.send('This is the secret content. Only logged in users can see that!');});
// Finds a user by their id
router.get('/:id/find', userController.verify, userController.findOne);
// This method prints out all the users
router.get('/all', userController.verify, userController.findAll);
// Deletes a single user of given id
router.delete('/:id/delete', userController.verify, userController.deleteUser);
// Updates A Single User in the Database
router.put('/:id/update', userController.verify, userController.updateUser);
// Sets one user to active
router.put('/:id/active', userController.verify, userController.setUserToActive);
// Sets one user to inactive
router.put('/:id/inactive', userController.verify, userController.setUserToInactive);
// Deletes all inactive users
router.delete('/delete', userController.verify, userController.deleteInactiveUsers);
// Verify's that the user is logged in
//router.get('/verify', userController.verify);
// Connection test
router.get('/test', (req, res) => {res.send( {message: 'This is a connection test!'});});

module.exports = router;
