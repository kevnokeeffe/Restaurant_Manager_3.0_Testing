let Order = require ('../models/orders');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/restaurantManager', { useNewUrlParser: true });
let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});



router.billOfOrders = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // Order.filter(orders.billId = billId.req.params.id === '1001');
    //Order.filter(billId => billId.req.params.billId === '1001');
    orders = new Order();
    function findById(orders.billId, req.params.billId) {
        for (let i = 0; i < orders.length; i++) {
            if (orders[i].id === id) {
                return source[i];
            }
        }
        throw "Couldn't find object with id: " + id;
    }
         //.find({"billId" : req.params.billId},function(err, orders) {
    //     if  (err)
    //         res.send(err);
    //     else orders.filter(req.params.billId);
    //     res.send(JSON.stringify(orders,null,5));
    // });

}

module.exports = router;