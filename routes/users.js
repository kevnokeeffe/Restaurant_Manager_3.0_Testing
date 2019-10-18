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


try {
    router.get('/',(req, res, next) => {
        res.send('respond with a resource');
    });
} catch(err){ message = "Input is " + err;}


try{
  function getByValue(array,id) {
    const result = array.filter(function(obj){return obj.id == id;});
    return result?result[0]:null;
  }
}catch(err){message = "Input is " + err;}

router.addUser=(req,res)=>{
  const id = Math.floor((Math.random()*1000000)+1);
  const user =({'id': id, 'fName': req.body.fName,'lName':req.body.lName,'email': req.body.email, 'password':req.body.password,'permission': req.body.permission});
  const currentSize = Users.length;
  Users.push(user);
  if((currentSize +1) == Users.length)
    res.json({message:'User Added'});
  else
    res.json({message:'User Not Added!'});
}


// router.addUser = (req, res) => {
//
//     res.setHeader('Content-Type', 'application/json');
//
//     let user = new User();
//
//     user.id = id;
//     user.fName = req.body.fName;
//     user.lName = req.body.lName;
//     user.email = req.body.email;
//     user.password = req.body.password;
//     user.permission = "average";
//
//     user.save(function(err) {
//         if (err)
//             res.send(err);
//         else
//             res.json({message:'Donation Added'});
//     });
// }

try{
  router.findOne = (req,res) => {
    const user = getByValue(Users, req.params.id);
    const removeDetails =
        delete user.password
    delete user.permission


    res.send(JSON.stringify(user, removeDetails ,5));
    user.remove(req.params.password);
    res.json(user);
  }
} catch (err){message = "Input is " + err;}

try {
  router.deleteUser = (req, res) => {
    const user = getByValue(Users, req.params.id);
    const position = Users.indexOf(user);

    if (position !== -1)
      Users.splice(position, 1),
          res.json({message: 'User Deleted'});
    else
      res.json({message: 'User Doesn\'t Exist!'});
  }
}catch (err){message = "Input is " + err;}

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