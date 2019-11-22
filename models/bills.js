let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let OrderSchema = new Schema({
	//_id: mongoose.Schema.Types.ObjectId,
	billId: {type: Number,required: true},
	userId: {type: String,required: true},
	payed: {type: Boolean},
	message: {type: String},
	orders: {type: Array, default:[]}
},
{ collection: 'bills' });

module.exports = mongoose.model('Bill', OrderSchema);