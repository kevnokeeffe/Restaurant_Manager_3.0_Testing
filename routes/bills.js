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
}

//Gives a list of unpaid bills
router.unPaidBills = (req,res) => {
    Order.find({"payed":false}).then(orders=> {
        console.log(orders);
        res.json({orders: orders});
    });
};

//Gives a list of payed bills
router.paidBills = (req,res) => {
    Order.find({"payed":true}).then(orders => {
        console.log(orders);
        res.json({orders: orders});
    });
};

//displays all the orders attached to a certain bill which have not been payed for, gives a total bill.
router.billOfOrders = (req, res) => {
    Order.find({$and: [{"billId":req.params.billId},{"payed":false}]}).then(orders=> {
        console.log(orders);
        res.json({orders: orders, totalBill: getTotalBill(orders)});
    })
};

//sets all orders of a certain bill to paid.
router.payBillOfOrders = (req,res) => {
    console.log("HERE")
        Order.updateMany({$and: [{"billId":req.params.billId},{"payed":false}]},{$set: { payed: true }}).then(orders=> {
            res.json({orders: orders, message: 'Bill Successfully Payed!'})
        })
            .catch(error => {
                console.log(error)
            });
};

//sets all orders of a certain bill to unpaid
router.unPayBillOfOrders = (req,res) => {
    console.log("HERE")
    Order.updateMany({$and: [{"billId":req.params.billId},{"payed":true}]},{$set: { payed: false }}).then(orders=> {
        res.json({orders: orders, message: 'Bill Set to unpaid!'})
    })
        .catch(error => {
            console.log(error)
        });
};

// gives a total read of all orders payed for.
router.totalRead = (req,res) => {
    Order.find({"payed":true}).then(orders=> {
        console.log(orders);
        res.json({orders: orders, totalBill: getTotalBill(orders)});
    })
};

router.deleteBill = (req,res) => {

}
module.exports = router;
