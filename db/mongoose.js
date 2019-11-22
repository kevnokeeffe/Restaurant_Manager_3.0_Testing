const mongoose = require("mongoose");
const {databasePassword, databaseUsername} = require('../config');
mongoose.Promise = global.Promise;

//Local connection:
//mongoose.connect('mongodb://localhost:27017/restaurantManager', { useNewUrlParser: true });

//mLab Connection:
//`mongodb://${databaseUsername}:${mLabPassword}@ds241097.mlab.com:41097/heroku_q1g0hzrw`;

mongoose
  .connect(
    `mongodb+srv://${databaseUsername}:${databasePassword}@cluster0-r3fv1.mongodb.net/restaurantManager?retryWrites=true&w=majority`
    ,{ useUnifiedTopology: true, useNewUrlParser: true , useCreateIndex:true })
  .then(() => console.log('Successfully Connected to [ ' + db.name + ' ]'))
  .catch(err => console.log('Unable to Connect to [ ' + db.name + ' ]' + ' on orders route', err));
  let db = mongoose.connection;

  module.exports = mongoose;