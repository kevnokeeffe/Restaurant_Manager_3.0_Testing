const mongoose = require("mongoose");
const {databasePassword, databaseUsername} = require('../config');
mongoose.Promise = global.Promise;
require('dotenv')
    .config();
//Local connection:
//mongoose.connect('mongodb://localhost:27017/${process.env.MONGO_DB_NAME}', { useNewUrlParser: true });

//mLab Connection:
//`mongodb://${process.env.MONGO_USER}:${process.env.MLAB_PASSWORD}@ds241097.mlab.com:41097/heroku_q1g0hzrw`;

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-r3fv1.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`
    ,{ useUnifiedTopology: true, useNewUrlParser: true , useCreateIndex:true })
  .then(() => console.log('Successfully Connected to [ ' + db.name + ' ]'))
  .catch(err => console.log('Unable to Connect to [ ' + db.name + ' ]' + ' on orders route', err));
  let db = mongoose.connection;

  module.exports = mongoose;