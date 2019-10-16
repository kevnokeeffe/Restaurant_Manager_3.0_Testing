// const orders=[
//     {id:100001,starter:'duck wings',main:'chicken goujons',desert:'cheesecake',drink:'coke', price:25.00,payed:true},
//     {id:100002,starter:'garlic mushrooms',main:'sunday chicken',desert:'cheesecake',drink:'beer',price:25.00,payed:false},
//     {id:100003,starter:'duck wings',main:'ham pizza',desert:'chocolate ice-cream',drink:'wine',price:25.00,payed:true},
//     {id:100004,starter:'duck wings',main:'sunday beef',desert:'cheesecake',drink:'orange',price:25.00,payed:false}
// ];
//
// module.exports = orders;

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