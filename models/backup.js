let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let OrderSchema = new Schema({
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
{ collection: 'backup' });

module.exports = mongoose.model('Backup', OrderSchema);