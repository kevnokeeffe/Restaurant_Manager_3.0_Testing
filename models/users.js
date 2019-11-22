let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UsersSchema = new Schema({
	//_id: mongoose.Schema.Types.ObjectId,
	fName: {type: String},
	lName: {type: String},
	email: {type: String, required: true, unique: true, match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
	//unique does not validate the field it just optimises the field to be searched and indexed. Gives performance optimization
	// match with a regex, checks to see if the email is of a valid type
	password: {type: String, required: true},
	permission: {type: String},
	active: {type: Boolean},
	registered: {type: String},
	last_login: {type: String},
	orders: {type: Array, default:[]}
},

{ collection: 'users' });

module.exports = mongoose.model('User', UsersSchema);