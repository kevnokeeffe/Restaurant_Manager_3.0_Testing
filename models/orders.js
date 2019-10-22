let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let OrderSchema = new Schema({
        billId: Number,
        userId: String,
        starter: String,
        main: String,
        desert: String,
        drink: String,
        price: Number,
        payed: Boolean,
        message: String
    },
    { collection: 'orders' });

module.exports = mongoose.model('Order', OrderSchema);