let Order = require ('../models/orders');
let Backup = require ('../models/backup');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
//let uriUtil = require('mongodb-uri');
let message

mongoose.connect('mongodb://localhost:27017/restaurantManager', { useNewUrlParser: true });

//message = "";
let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]' + ' on orders route', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]'+ ' on orders route');
});

    function getByValue(array,id){
        const result = array.filter(function(obj){return obj.id == id;});
        return result?result[0]:null;
    }

//Finds an order by its id
router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Order.find({ "_id" : req.params.id },function(err, orders) {
        if (err)
            res.json({ message: 'Order NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(orders,null,5));
    });
};

//Deletes an order
    router.deleteOrder = (req, res) => {
        Order.findByIdAndRemove(req.params.id, function(err) {
            if (err)
                res.json({ message: 'Order NOT DELETED!', errmsg : err } );
            else
                res.json({ message: 'Order Successfully Deleted!'});
        });
    };

//Gives a list of all orders on the system
router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Order.find(function(err, orders) {
        if (err)
            res.send(err);
        res.send(JSON.stringify(orders,null,5));
    });
}

//Sets an order to payed
router.orderPayed = (req,res)=>{
    res.setHeader('Content-Type', 'application/json');
        Order.findById({"_id" : req.params.id}, function(err,order){
            if(err)
                res.send(err),
                res.json({message: "orderPayed Error"});
            else{
                order.payed = true;
                order.save(function(err){
                   if(err)
                       res.json({ message: 'Order Not Payed!'});
                   else
                       res.json({ message: 'Order Successfully Payed!'});
                });
            }
        });
}

//Sets an order to not payed
router.orderNotPayed = (req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    Order.findById({"_id" : req.params.id}, function(err,order){
        if(err)
            res.send(err),
                res.json({message: "orderNotPayed Error"});
        else{
            order.payed = false;
            order.save(function(err){
                if(err)
                    res.json({ message: 'Order Still Payed!'});
                else
                    res.json({ message: 'Order Set to Unpaid!'});
            });
        }
    });
}

//Adds an order
router.addOrder = (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    let order = new Order();

    order.billId = req.body.billId;
    order.userId = req.body.userId;
    order.starter = req.body.starter;
    order.main = req.body.main;
    order.desert = req.body.desert;
    order.drink = req.body.drink;
    order.price = req.body.price;
    order.payed = false;


    order.save(function(err) {
        if (err)
            res.json({ message: 'Order NOT Added!', errmsg : err } );
        else
            res.json({ message: 'Order Successfully Added!', data: order });
    });
}
    module.exports = router;
