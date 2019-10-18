let Order = require ('../models/orders');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/restaurantManager', { useNewUrlParser: true });
let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]'+ ' on bills route', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]'+ ' on bills route');
});

function getTotalBill(array) {
    let totalBill = 0;
    array.forEach(function(obj){ totalBill += obj.price});
    return totalBill;
};

function unPayedBill(array) {
    // some how i eed to filter the orders to see only the bills not payed for.
};

//////////////////////////////////////////////////////////////////
// const order = new Order;
// let payed = false;
// let id = 1001;
// array.forEach(function(obj){ if (payed == obj.payed && id == obj.billId){
//     order.obj.billId
//     //res.json({order});
//
// }});
// return order;


router.billsAndMoreBills = (req,res) =>{
    Order.find(function(err,orders){
        if(err)
            res.send(err);
        else
            res.json({ order : unPayedBill(orders) });
});
};

router.billOfOrders = (req, res) => {
    //some how i need to filter the array so only the elements belonging to a certain bill are displayed
    //extra condition is that the item has not already been payed for.
    Order.find({$and: [{"billId":req.params.billId},{"payed":false}]}).then(orders=> {
        console.log(orders);
        res.json({orders: orders, totalBill: getTotalBill(orders)});
    })
};

module.exports = router;
