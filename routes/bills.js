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
    array.forEach(function(obj){ totalBill += obj.price})
    return totalBill;
}

function unPayedBill(array) {
    let payed = false;
    let id = 1001;
    array.forEach(function(obj){ if (payed == obj.payed && id == obj.billId){
        return obj;
    }})
}

router.billOfOrders = (req, res) => {
    //res.setHeader('Content-Type', 'application/json');
    Order.find(function(err,orders){
        if(err)
            res.send(err);
        else
            res.json({ totalBill : getTotalBill(orders) });

    })
}

module.exports = router;

//orders.forEach(function(obj) {
// if (id === obj.billId){
//  res.json({ totalBill : getTotalBill(orders) });
// }
// else if(err)
// res.send(err);
// })
//////////////////////////////////////////////////////////////

// Order.filter(orders.billId = billId.req.params.id === '1001');
//Order.filter(billId => billId.req.params.billId === '1001');
// orders = new Order();
// function findById(orders.billId, req.params.billId) {
//     for (let i = 0; i < orders.length; i++) {
//         if (orders[i].id === id) {
//             return source[i];
//         }
//     }
//     throw "Couldn't find object with id: " + id;
// }
//.find({"billId" : req.params.billId},function(err, orders) {
//     if  (err)
//         res.send(err);
//     else orders.filter(req.params.billId);
//     res.send(JSON.stringify(orders,null,5));
// });