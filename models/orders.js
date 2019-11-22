let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let OrderSchema = new Schema({
	//_id: mongoose.Schema.Types.ObjectId,
	billId: {type: Number},
	userId: {type: String},
	starter: {type: String},
	main: {type: String},
	desert: {type: String},
	drink: {type: String},
	price: {type: Number},
	payed: {type: Boolean},
	message: {type: String}
},
{ collection: 'orders' });

module.exports = mongoose.model('Order', OrderSchema);