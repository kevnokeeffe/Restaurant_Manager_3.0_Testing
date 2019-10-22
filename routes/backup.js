let Order = require ('../models/orders');
let User = require ('../models/users');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/restaurantManager', { useNewUrlParser: true });
let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]'+ ' on backup route', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]'+ ' on backup route');
});