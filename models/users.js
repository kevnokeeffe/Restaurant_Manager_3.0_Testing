let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let OrderSchema = new Schema({
        _id: mongoose.Schema.Types.ObjectId,
        fName: {type: String},
        lName: {type: String},
        email: {type: String, required: true, unique: true},
        //unique does not validate the field it just optimises the field to be searched and indexed. Gives performance optimization

        password: {type: String, required: true},
        permission: {type: String},
        active: {type: Boolean},
    },

    { collection: 'users' });

module.exports = mongoose.model('User', OrderSchema);