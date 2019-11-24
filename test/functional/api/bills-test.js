// const expect = require('chai').expect;
// const Order = require('../../../models/orders');
// const request = require('supertest');
// const _ = require('lodash');
// const mongoose = require('../../../db/mongoose');
// const {databasePassword, databaseUsername} = require('../../../config');
//
// let server;
// let db, validID, validID2;
//
// describe('Bill', () => {
// 	before(async () => {
// 		try {
// 			mongoose.connect(`mongodb+srv://${databaseUsername}:${databasePassword}@cluster0-r3fv1.mongodb.net/restaurantManager?retryWrites=true&w=majority`, {
// 				useNewUrlParser: true,
// 				useUnifiedTopology: true,
// 				useFindAndModify: false
// 			});
// 			server = require('../../../bin/www');
// 			db = mongoose.connection;
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	});
//
// 	after(async () => {
// 		try {
// 			await db.dropDatabase();
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	});
//
//
// 	beforeEach(async () => {
// 		try {
// 			const order = new Order({
// 				billId: 1224,
// 				userId: '5db1fd86f7b46c3ac05d7632',
// 				starter: 'cake',
// 				main: 'ice-cream',
// 				desert: 'cheesecake',
// 				drink: 'coke',
// 				price: 25.99,
// 				payed: false,
// 				message: '5db1fd86f7c'
// 			});
// 			await order.save();
// 			const order1 = await Order.findOne({message: '5db1fd86f7c'});
// 			validID = order1.billId;
//
// 			const order2 = new Order({
// 				billId: 1224,
// 				userId: '5db1fd86f7b46c3ac05d7632',
// 				starter: 'cake',
// 				main: 'ice-cream',
// 				desert: 'cheesecake',
// 				drink: 'coke',
// 				price: 25.99,
// 				payed: false,
// 				message: '5db1fd86f7b46c3ac05d7632a'
// 			});
// 			await order2.save();
// 			const orders2 = await Order.findOne({message: '5db1fd86f7b46c3ac05d7632a'});
// 			validID2 = orders2._id;
// 			//console.log(order1);
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	});
//
//
// 	describe('GET /bill', () => {
// 		describe('when the id is valid', () => {
// 			try {
// 				it('should return the matching bill', done => {
// 					try {
// 						request(server)
// 							.get(`/bill/${validID}/get`)
// 							.set('Accept', 'application/json')
// 							.expect('Content-Type', /json/)
// 							.expect(200)
// 							.end((err, res) => {
// 								try {
// 									expect(res.body.message).equals('Bill found');
// 									done(err);
// 								} catch (error) {
// 									console.log(error);
// 								}
// 							});
// 					} catch (error) {
// 						console.log(error);
// 					}
// 				});
// 			} catch (error) {
// 				console.log(error);
// 			}
// 		});
//
// 		describe('when the id is invalid', () => {
// 			it('should return the NOT found message', done => {
// 				try {
// 					request(server)
// 						.get('/bill/9999/get')
// 						.set('Accept', 'application/json')
// 						.expect('Content-Type', /json/)
// 						.expect(404)
// 						.end((err, res) => {
// 							try {
// 								expect(res.body.message).equals('Bill not found!');
// 								done(err);
// 							} catch (error) {
// 								console.log(error);
// 							}
// 						});
// 				} catch (error) {
// 					console.log(error);
// 				}
// 			});
// 		});
// 	});
//
// 	describe('DELETE /bill', () => {
// 		describe('when the id is valid', () => {
// 			it('should delete a the bill', done => {
//
// 				try {
// 					request(server)
// 						.delete(`/bill/${validID}/delete`)
// 						.expect(200)
// 						.expect('Content-Type', /json/)
// 						.then(res => {
// 							try {
// 								expect(res.body).to.include({
// 									message: 'Bill Deleted!'
// 								});
// 								//console.log("DELETE")
// 							} catch (error) {
// 								console.log(error);
// 							}
// 						});
//
// 				} catch (err) {
// 					console.log('fail');
// 				}
// 				done();
// 			});
// 			after(() => {
// 				try {
// 					return request(server)
// 						.get(`/bill/${validID}/get`)
// 						.expect(404)
// 						.expect({message: 'Bill not found!', error: {}});
// 				} catch (error) {
// 					console.log(error);
// 				}
// 			});
// 		});
// 		describe('when the id is invalid', () => {
// 			it('should return the NOT found message', done => {
// 				try {
// 					request(server)
// 						.delete('/bill/8798jj7/delete')
// 						.set('Accept', 'application/json')
// 						.expect('Content-Type', /json/)
// 						.expect(404)
// 						.expect({message: 'Failed'});
// 					done();
// 				} catch (error) {
// 					console.log(error);
// 				}
// 			});
// 		});
// 	});
// 	describe('GET_TOTAL /bill/billId/total', () => {
// 		describe('Total Bill', () => {
// 			it('should get the total price for a bill', done => {
// 				try {
// 					request(server)
// 						.get(`/bill/${validID}/total`)
// 						.expect(200)
// 						.expect('Content-Type', /json/)
// 						.then(res => {
// 							try {
// 								//console.log({message:"what:",validID})
// 								expect(res.body).to.include({
// 									totalBill: 103.96
// 								});
// 							} catch (error) {
// 								console.log(error);
// 							}
// 						});
// 					done();
// 				} catch (error) {
// 					console.log(error);
// 				}
// 			});
//
// 			after(() => {
// 				try {
// 					return request(server)
// 						.get(`/bill/${validID}/get`)
// 						.expect(200);
// 				} catch (error) {
// 					console.log(error);
// 				}
// 			});
// 		});
// 		describe('when the id is invalid', () => {
// 			it('should return a Failed message', done => {
// 				try {
// 					request(server)
// 						.get('/bill/8798jj7/total')
// 						.set('Accept', 'application/json')
// 						.expect('Content-Type', /json/)
// 						.expect(404)
// 						.expect({message: 'Failed'});
// 					done();
// 				} catch (error) {
// 					console.log(error);
// 				}
// 			});
// 		});
//
// 	});
//
// 	describe('PAY BILL OF ORDERS /bill', () => {
// 		describe('when the id is valid', () => {
// 			it('should return a message and paid true', () => {
// 				try {
// 					return request(server)
// 						.put(`/bill/${validID}/payBill`)
// 						.expect(200)
// 						.then(resp => {
// 							try {
// 								expect(resp.body).to.include({
// 									message: 'Bill Successfully Payed!'
// 								});
// 							} catch (error) {
// 								console.log(error);
// 							}
// 							//expect(resp.body.data).to.have.deep.property('[0].payed', 'true');
// 						});
// 				} catch (error) {
// 					console.log(error);
// 				}
// 			});
// 			after(() => {
// 				try {
// 					return request(server)
// 						.get(`/bill/${validID}/find`)
// 						.expect(404);
// 				} catch (error) {
// 					console.log(error);
// 				}
// 			});
// 		});
// 		describe('PAY BILL OF ORDERS', () => {
// 			it('should try set a bill to payed and fail', done => {
//
// 				try {
// 					request(server)
// 						.put('/bill/5gy5g4654/payBill')
// 						.expect('Content-Type', /json/)
// 						.expect(404)
// 						.expect({message: 'Failed'});
// 					done();
//
// 				} catch (error) {
// 					console.log(error);
// 				}
//
// 			});
// 		});
// 	});
//
// 	describe('UNPAY BILL OF ORDERS /bill', () => {
// 		describe('when the id is valid', () => {
// 			it('should return a message and paid false', () => {
// 				try {
// 					return request(server)
// 						.put(`/bill/${validID}/unPayBill`)
// 						.expect(200)
// 						.then(resp => {
// 							try {
// 								expect(resp.body).to.include({
// 									message: 'Bill Set to unpaid!'
// 								});
// 							} catch (error) {
// 								console.log(error);
// 							}
//
// 						});
// 				} catch (error) {
// 					console.log(error);
// 				}
// 			});
// 			after(() => {
// 				try {
// 					return request(server)
// 						.get(`/bill/${validID}/find`)
// 						.expect(404);
// 				} catch (error) {
// 					console.log(error);
// 				}
// 			});
// 		});
//
// 		describe('UNPAY BILL OF ORDERS /order/:id/unpay', () => {
// 			it('should try and unpay a bill and fail', done => {
//
// 				try {
// 					request(server)
// 						.put('/bill/5gy5g4654/unPayBill')
// 						.expect('Content-Type', /json/)
// 						.expect(404)
// 						.expect({message: 'Failed'});
// 					done();
//
// 				} catch (error) {
// 					console.log(error);
// 				}
//
// 			});
// 		});
// 	});
//
// 	describe('PAID AND UNPAID BILL CHECK', () => {
// 		describe('when the id is valid', () => {
// 			try {
// 				it('should return the paid bill', () => {
// 					try {
// 						request(server)
// 							.get('/bill/paidBills')
// 							.set('Accept', 'application/json')
// 							.expect('Content-Type', /json/)
// 							.expect(200)
// 							.then(resp => {
// 								try {
// 									expect(resp.body).to.include({
// 										message: 'found'
// 									});
// 								} catch (error) {
// 									console.log(error);
// 								}
//
// 							});
// 					} catch (error) {
// 						console.log(error);
// 					}
// 				});
// 			} catch (error) {
// 				console.log(error);
// 			}
// 		});
// 		describe('when the id is valid', () => {
// 			try {
// 				it('should return the unpaid bills', () => {
// 					try {
// 						request(server)
// 							.get('/bill/unPaidBills')
// 							.set('Accept', 'application/json')
// 							.expect('Content-Type', /json/)
// 							.expect(200)
// 							.then(resp => {
// 								try {
// 									expect(resp.body).to.include({
// 										message: 'found'
// 									});
// 								} catch (error) {
// 									console.log(error);
// 								}
//
// 							});
// 					} catch (error) {
// 						console.log(error);
// 					}
// 				});
// 			} catch (error) {
// 				console.log(error);
// 			}
// 		});
// 	});
//
// });
