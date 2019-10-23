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
const backup = require("./routes/backup");

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

//Orders calls
app.get('/order/all',orders.findAll);
app.get('/order/findOne/:id',orders.findOne);
app.delete('/order/:id/delete', orders.deleteOrder);
app.post('/order/add', orders.addOrder);
app.put('/order/payed/:id', orders.orderPayed);
app.put('/order/unpaid/:id', orders.orderNotPayed);
app.put('/order/update/:id', orders.updateOrder);

//Users calls
app.get('/user/:id/find',users.findOne);
//app.get('/user/:id/orders',users.usersOrders);
app.delete('/user/:id/delete', users.deleteUser);
app.post('/user/add', users.addUser);
app.get('/user/all', users.findAll);
app.put('/user/:id/inactive',users.setUserToInactive);
app.put('/user/:id/active', users.setUserToActive);
app.put('/user/:id/addOrder',users.addUsersOrders);
app.delete('/user/delete',users.deleteInactiveUsers);

//Bills calls
app.get('/bill/:billId/total', bills.billOfOrders);
app.put('/bill/:billId/payBill',bills.payBillOfOrders);
app.get('/bill/unpaidBills/',bills.unPaidBills);
app.put('/bill/:billId/unPayBill',bills.unPayBillOfOrders);
app.get('/bill/totalRead',bills.totalRead);
app.get('/bill/paidBills', bills.paidBills);
app.delete('/bill/:billId/delete',bills.deleteBill);

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
