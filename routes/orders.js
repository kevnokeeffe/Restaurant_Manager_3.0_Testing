let Order = require('../models/orders');
let express = require('express');
let router = express.Router();
let auth = require('../auth/auth-service')

router.findOne = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	Order.find({ '_id': req.params.id }, function (err, orders) {
		if (err)
			res.status(500).json({ message: 'Order NOT Found!' });
		else
			res.status(200).send(JSON.stringify(orders, null, 5));
	})
		.catch(err => {
		res.status(500).json({ message: 'Order NOT Found!' });
	});
};

//Deletes an order
router.deleteOrder = (req, res, next) => {
	res.setHeader('Content-Type', 'application/json');
	Order.deleteOne({ '_id': req.params.id }).exec().then(promis => {
		res.status(200).json({ message: 'Order deleted', promis: promis });

	}).catch(err => {
		res.status(500).json({ message: 'Order not deleted', error: err });
	});
};

//Gives a list of all orders on the system
router.findAll = ((req, res) => {
	res.setHeader('Content-Type', 'application/json');
	Order.find(function (err, orders) {
		if (err)
			res.send(err);
		res.send(orders);
	})
		.catch(err => {
		res.status(500).json({ error: err });
	});
});

//Sets an order to payed
router.orderPayed = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	Order.findById({ '_id': req.params.id }, function (err, order) {
		if (err)
			res.send(err),
			res.status(404).json({ message: 'orderPayed Error' });
		else {
			order.payed = true;
			order.save(function (err) {
				if (err)
					res.json({ message: 'Order Not Payed!' });
				else
					res.json({ message: 'Order Successfully Payed!' });
			});
		}
	}).catch(err => {
		res.status(500).json({ message: 'Invalid Input Error' });
	});
};

//Sets an order to not payed
router.orderNotPayed = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	Order.findById({ '_id': req.params.id }, function (err, order) {
		if (err)
			res.send(err),
			res.status(404).json({ message: 'orderNotPayed Error' });
		else {
			order.payed = false;
			order.save(function (err) {
				if (err)
					res.json({ message: 'Order Still Payed!' });
				else
					res.json({ message: 'Order Set to Unpaid!' });
			});
		}
	}).catch(err => {
		//console.log(err);
		res.status(500).json({ error: err });
	});
};

//Adds an order
router.addOrder = ((req, res, next) => {

		res.setHeader('Content-Type', 'application/json');
		const order = new Order({
			//_id: mongoose.Schema.Types.ObjectID(),
			billId: req.body.billId,
			userId: req.body.id,
			starter: req.body.starter,
			main: req.body.main,
			desert: req.body.desert,
			drink: req.body.drink,
			price: req.body.price,
			payed: false,
			message: req.body.message
		});
		order
			.save()
			.then(result => {
				res.status(201).json({
					message: 'Order Created',
					data: order
				});
			}).catch(err => {
			res.status(500).json({
				message: 'Order not created!',
				error: err
			});
		});
});

// Updates an order.
router.updateOrder = (req, res, next) => {

	res.setHeader('Content-Type', 'application/json');
	Order.findOneAndUpdate({ '_id': req.params.id }, {
		$set: {
			billId: req.body.billId,
			userId: req.body.userId,
			starter: req.body.starter,
			main: req.body.main,
			desert: req.body.desert,
			drink: req.body.drink,
			price: req.body.price,
			payed: req.body.payed,
			message: req.body.message
		}
	}).then(order => { res.status(200).json({ order: order, message: 'Update Successfully' }); })
		.catch(err => {
			res.status(500).json({
				message: 'Order not updated!'
			});
		});
};

module.exports = router;
