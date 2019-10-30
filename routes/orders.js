import Order from '../models/orders';
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');


//Local connection
//mongoose.connect('mongodb://localhost:27017/restaurantManager', { useNewUrlParser: true });

//mLab Connection
const mongodbUri = "mongodb://dbKevin:akakok1984@ds241097.mlab.com:41097/heroku_q1g0hzrw";

//mongodb Atlas connection
//const mongodbUri = "mongodb+srv://dbKevin:KEV1984me@kevinscluster-cvmeg.mongodb.net/restaurantManager";

mongoose.connect(mongodbUri,{ useNewUrlParser: true });

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
    }).catch(err => {
        console.log(err);
        res.status(500).json({message: 'Order NOT Found!',error:err});
    });
};

//Deletes an order
router.deleteOrder = (req,res,next) => {
    res.setHeader('Content-Type', 'application/json');
    Order.deleteOne({"_id": req.params.id}).exec().then( promis =>{
        console.log(promis);
        res.status(200).json({messege:"Order deleted",promis:promis})

    }).catch(err => {
        console.log(err);
        res.status(500).json({messege:"Order not deleted",error:err});
    });
};

//Gives a list of all orders on the system
router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Order.find(function(err, orders) {
        if (err)
            res.send(err);
        res.send(JSON.stringify(orders,null,5));
    }).catch(err => {
        console.log(err);
        res.status(500).json({error:err});
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
        }).catch(err => {
            console.log(err);
            res.status(500).json({error:err});
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
    }).catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
};

//Adds an order
router.addOrder = ((req, res,next) => {

    res.setHeader('Content-Type', 'application/json');
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
    // Future update
    // const backup = order.find
    // Users.findOneAndUpdate(_id: req.user._id}, {$push: {orders: order}});
});

// Updates an order.
router.updateOrder = (req,res,next) => {

    res.setHeader('Content-Type', 'application/json');
Order.findOneAndUpdate({'_id': req.params.id},{$set: {
                billId: req.body.billId,
                userId: req.body.userId,
                starter: req.body.starter,
                main: req.body.main,
                desert: req.body.desert,
                drink: req.body.drink,
                price: req.body.price,
                payed: req.body.payed,
                message: req.body.message
            }}).then (order => {res.json({order: order, message: 'Update Successfully'})})

    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Order not updated!",
            error: err
        });
    });
};

    module.exports = router;
