let Order = require('../models/orders');
let Backup = require('../models/backup');
let express = require('express');
let router = express.Router();

function getTotalBill(array) {
	let totalBill = 0;
	array.forEach(function (obj) { totalBill += obj.price; });
	return totalBill;
}

//Get a Bill
router.getBill = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	Order.find({ 'billId': req.params.billId }).then(orders => {
		//console.log(orders);
		if (orders.length >= 1) {
			res.status(200).json({ message: 'Bill found', orders: orders });
		} else {
			res.status(500).json({
				message: 'Bill not found!',
				error: err
			});
		}
	}).catch(err => {
		//console.log(err);
		res.status(404).json({
			message: 'Bill not found!',
			error: err
		});
	});
};

//Gives a list of unpaid bills
router.unPaidBills = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	Order.find({ 'payed': false }).then(orders => {
		//console.log(orders);
		res.status(200).json({ message: 'found', orders: orders });
	}).catch(err => {
		//console.log(err);
		res.status(404).json({
			message: 'Failed',
			error: err
		});
	});
};

//Gives a list of payed bills
router.paidBills = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	Order.find({ 'payed': true }).then(orders => {
		//console.log(orders);
		res.status(200).json({ message: 'found', orders: orders });
	}).catch(err => {
		//console.log(err);
		res.status(404).json({
			message: 'Failed',
			error: err
		});
	});
};

//Displays all the orders attached to a certain bill which have not been payed for, gives a total bill.
router.billOfOrders = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	Order.find({ $and: [{ 'billId': req.params.billId }, { 'payed': false }] }).then(orders => {
		//console.log(orders);
		res.json({ orders: orders, totalBill: getTotalBill(orders) });
	}).catch(err => {
		//console.log(err);
		res.status(404).json({
			message: 'Failed',
			error: err
		});
	});
};

//Sets all orders of a certain bill to paid.
router.payBillOfOrders = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	//console.log("HERE")
	Order.updateMany({ $and: [{ 'billId': req.params.billId }, { 'payed': false }] }, { $set: { payed: true } }).then(orders => {
		res.status(200).json({ orders: orders, message: 'Bill Successfully Payed!' });
	})
		.catch(err => {
			//console.log(err);
			res.status(404).json({
				message: 'Failed',
				error: err
			});
		});
};

//Sets all orders of a certain bill to unpaid
router.unPayBillOfOrders = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	//console.log("HERE")
	Order.updateMany({ $and: [{ 'billId': req.params.billId }, { 'payed': true }] }, { $set: { payed: false } }).then(orders => {
		res.json({ orders: orders, message: 'Bill Set to unpaid!' });
	})
		.catch(err => {
			//console.log(err);
			res.status(404).json({
				message: 'Failed',
				error: err
			});
		});
};

//Gives a total read of all orders payed for.
router.totalRead = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	Order.find({ 'payed': true }).then(orders => {
		//console.log(orders);
		res.status(200).json({message: 'worked', orders: orders, totalBill: getTotalBill(orders) });
	}).catch(err => {
		//console.log(err);
		res.status(404).json({
			message: 'Failed',
			error: err
		});
	});
};

//Deletes a bill
//I wish to add a backup that makes a copy of the deleted bill
//and sends it to a backup database, which contains historical
// bills and orders for later reference.
router.deleteBill = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	Order.deleteMany({ 'billId': req.params.billId }).then(promis => {
		//console.log(promis);
		res.json({ message: 'Bill Deleted!', promis: promis });

	}).catch(err => {
		//console.log(err);
		res.status(404).json({
			message: 'Failed',
			error: err
		});
	});
};

module.exports = router;
