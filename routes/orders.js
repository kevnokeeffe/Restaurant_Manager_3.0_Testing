let Order = require ('../models/orders');
let Backup = require ('../models/backup');
let User = require ('../models/backup');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
//let uriUtil = require('mongodb-uri');
let message;

mongoose.connect('mongodb://localhost:27017/restaurantManager', { useNewUrlParser: true });

//message = "";
let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]' + ' on orders route', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]'+ ' on orders route');
});

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
};

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
};

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
};

//Adds an order
router.addOrder = ((req, res,next) => {

    //res.setHeader('Content-Type', 'application/json');
    const order = new Order({
        //_id: mongoose.Schema.Types.ObjectID(),
        billId: req.body.billId,
        userId: req.body.userId,
        starter: req.body.starter,
        main: req.body.main,
        desert: req.body.desert,
        drink: req.body.drink,
        price: req.body.price,
        payed: false,
        message: req.body.message
    });
    order
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Order Created",
                data: order
            });
        }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Order not created!",
            error: err
        });
    });
    // insert code here
    // const backup = order.find
    // Users.findOneAndUpdate(_id: req.user._id}, {$push: {orders: order}});
});

// router.updateOrder2 = ( req, res, next) => {
//     res.setHeader('Content-Type', 'application/json');
//     Order.findOneAndUpdate({"_id": req.params.id}, {$set:{'main': 'Something'}})};

// Building a method that can update an order.
router.updateOrder = ((req,res,next) => {

});
//     const ordId = req.body._id;
//     const UpdateBillId = req.body.billId;
//     const UpdateUserId = req.body.userId;
//     const UpdateStarter = req.body.starter;
//     const UpdateMain = req.body.main;
//     const UpdateDesert = req.body.desert;
//     const UpdateDrink = req.body.drink;
//     const UpdatePrice = req.body.price;
//     const UpdatePayed = req.body.payed;
//     const UpdateMessage = req.body.message;
//
//     const order = new Order(
//         UpdateBillId,
//         UpdateUserId,
//         UpdateStarter,
//         UpdateMain,
//         UpdateDesert,
//         UpdateDrink,
//         UpdatePrice,
//         UpdatePayed,
//         UpdateMessage
//
//     );
//     order
//         .save(order)
//         .then(result => {
//             console.log('Updated Order!');
//             res.redirect('/routes/orders')
//         })
//         .catch(err => console.log(err));
// };

    module.exports = router;
