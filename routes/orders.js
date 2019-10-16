let Order = require ('../models/orders');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
//let uriUtil = require('mongodb-uri');
let message

mongoose.connect('mongodb://localhost:27017/restaurantManager', { useNewUrlParser: true });

//message = "";
let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

    function getByValue(array,id){
        const result = array.filter(function(obj){return obj.id == id;});
        return result?result[0]:null;
    }

router.addOrder = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    let order = new Order();

    order.id = req.body.id;
    order.starter = req.body.starter;
    order.main = req.body.main;
    order.desert = req.body.desert;
    order.drink = req.body.drink;
    order.price = req.body.price;
    order.payed = req.body.payed;


    order.save(function(err) {
        if (err)
            res.json({ message: 'Order NOT Added!', errmsg : err } );
        else
            res.json({ message: 'Order Successfully Added!', data: order });
    });
}

router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Order.find({ "_id" : req.params.id },function(err, orders) {
        if (err)
            res.json({ message: 'Order NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(orders,null,5));
    });
}



    router.deleteOrder = (req, res) => {

        Order.findByIdAndRemove(req.params.id, function(err) {
            if (err)
                res.json({ message: 'Order NOT DELETED!', errmsg : err } );
            else
                res.json({ message: 'Order Successfully Deleted!'});
        });

    }


router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Order.find(function(err, orders) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(orders,null,5));
    });
}

    module.exports = router;
