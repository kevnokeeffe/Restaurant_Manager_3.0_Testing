let Order = require ('../models/orders');
let Backup = require ('../models/backup');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost:27017/restaurantManager', { useNewUrlParser: true });
const mongodbUri = "mongodb+srv://dbKevin:KEV1984me@kevinscluster-cvmeg.mongodb.net/restaurantManager";
mongoose.connect(mongodbUri,{ useNewUrlParser: true });
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
    }).catch(error => {
        console.log(error)
    });
};

//Gives a list of payed bills
router.paidBills = (req,res) => {
    Order.find({"payed":true}).then(orders => {
        console.log(orders);
        res.json({orders: orders});
    }).catch(error => {
        console.log(error)
    });
};

//Displays all the orders attached to a certain bill which have not been payed for, gives a total bill.
router.billOfOrders = (req, res) => {
    Order.find({$and: [{"billId":req.params.billId},{"payed":false}]}).then(orders=> {
        console.log(orders);
        res.json({orders: orders, totalBill: getTotalBill(orders)});
    }).catch(error => {
        console.log(error)
    });
};

//Sets all orders of a certain bill to paid.
router.payBillOfOrders = (req,res) => {
    console.log("HERE")
        Order.updateMany({$and: [{"billId":req.params.billId},{"payed":false}]},{$set: { payed: true }}).then(orders=> {
            res.json({orders: orders, message: 'Bill Successfully Payed!'})
        })
            .catch(error => {
                console.log(error)
            });
};

//Sets all orders of a certain bill to unpaid
router.unPayBillOfOrders = (req,res) => {
    console.log("HERE")
    Order.updateMany({$and: [{"billId":req.params.billId},{"payed":true}]},{$set: { payed: false }}).then(orders=> {
        res.json({orders: orders, message: 'Bill Set to unpaid!'})
    })
        .catch(error => {
            console.log(error)
        });
};

//Gives a total read of all orders payed for.
router.totalRead = (req,res) => {
    Order.find({"payed":true}).then(orders=> {
        console.log(orders);
        res.json({orders: orders, totalBill: getTotalBill(orders)});
    }).catch(error => {
        console.log(error)
    });
};

//Deletes a bill
//I wish to add a backup that makes a copy of the deleted bill
//and sends it to a backup database, which contains historical
// bills and orders for later reference.
router.deleteBill = (req,res) => {
    Order.deleteMany({"billId": req.params.billId}).then( promis =>{
        console.log(promis);
        res.json({messege:"Bill deleted",promis:promis})

}).catch(error => {
        console.log(error)
    });
};

module.exports = router;
