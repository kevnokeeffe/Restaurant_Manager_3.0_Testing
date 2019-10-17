let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
const orders = require("./routes/orders");
const users = require("./routes/users");
const bills = require("./routes/bills");

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/orders',orders.findAll);
app.get('/orders/:id',orders.findOne);
app.get('/users/:id',users.findOne);
app.get('users/:id',users.findID);
app.delete('/orders/:id/delete', orders.deleteOrder);
app.delete('/users/:id/delete', users.deleteUser);
app.post('/users/add', users.addUser);
app.post('/orders/add', orders.addOrder);
app.post('/orders/:id/payed', orders.orderPayed);;
app.get('/bills/total', bills.billOfOrders);
app.get('/bills/all', bills.billsAndMoreBills);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
