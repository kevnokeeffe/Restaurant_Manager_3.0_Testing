let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let OrderSchema = new Schema({

        fName: String,
        lName: String,
        email: String,
        password: String,
        permission: String,
        active: Boolean,
    },

    { collection: 'users' });

module.exports = mongoose.model('User', OrderSchema);