let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let OrderSchema = new Schema({
        billId: Number,
        starter: String,
        main: String,
        desert: String,
        drink: String,
        price: Number,
        payed: Boolean
    },
    { collection: 'orders' });

module.exports = mongoose.model('Order', OrderSchema);