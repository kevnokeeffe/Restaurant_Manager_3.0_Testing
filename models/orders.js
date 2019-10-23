let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let OrderSchema = new Schema({
        //_id: mongoose.Schema.Types.ObjectId,
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