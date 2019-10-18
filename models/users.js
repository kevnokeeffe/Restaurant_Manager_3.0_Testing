let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let OrderSchema = new Schema({

        fName: String,
        lName: String,
        email: String,
        password: String,
        permission: String,
    },

    { collection: 'users' });

module.exports = mongoose.model('User', OrderSchema);

//const users=[
//     {
//         id:200001,
//         fName:'kevin',
//         lName:'o keeffe',
//         email:'kevokeeffe@gmail.com',
//         password:'123456',
//         permission:"admin"
//     },
//     {
//         id:200002,
//         fName:'peter',
//         lName:'griffen',
//         email:'petergriffen@gmail.com',
//         password:'123456',
//         permission:"average"
//     }
// ];
//
// module.exports = users;