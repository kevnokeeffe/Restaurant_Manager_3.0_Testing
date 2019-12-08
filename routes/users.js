let express = require('express');
let router = express.Router();
const userController = require('../controllers/user-control');
const controller = require('../auth/VerifyToken');
// This method registers a user
router.post('/register', userController.register);
// Login
router.post('/login', userController.login);
//LogOut
router.get('/logout', userController.logout);
// Access Area
router.get('/secret-route', controller.verifyToken, (req, res) => {res.send('This is the secret content. Only logged in users can see that!');});
// Finds a user by their id
router.get('/:id/find', controller.verifyToken, userController.findOne);
// This method prints out all the users
router.get('/all', controller.verifyToken, userController.findAll);
// Deletes a single user of given id
router.delete('/:id/delete', controller.verifyToken, userController.deleteUser);
// Updates A Single User in the Database
router.put('/:id/update', controller.verifyToken, userController.updateUser);
// Sets one user to active
router.put('/:id/active', controller.verifyToken, userController.setUserToActive);
// Sets one user to inactive
router.put('/:id/inactive', controller.verifyToken, userController.setUserToInactive);
// Deletes all inactive users
router.delete('/delete', controller.verifyToken, userController.deleteInactiveUsers);
// Verify's that the user is logged in
//router.get('/verify', userController.verify);
// Connection test
router.get('/test', (req, res) => {res.send( {message: 'This is a connection test!'});});

module.exports = router;
