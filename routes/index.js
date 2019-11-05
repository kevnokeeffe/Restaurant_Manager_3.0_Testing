let express = require('express');
let router = express.Router();

let message;

message = "";

try {
  router.get('/', function (req, res, next) {
    res.render('index', { title: 'Restaurant Manager 3.0' });

  });
} catch (err) { message = "Input is " + err; }

finally {
  module.exports = router;
}
