const expect = require('chai').expect;
const Order = require("../models/orders");
const request = require("supertest");
const _ = require("lodash");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const mongoose = require("mongoose");



let server;
let mongod;
let db, validID, validID2;

describe('Bill', () => {
    before(async () => {
        try {
            mongod = new MongoMemoryServer({
                instance: {
                    port: 27017,
                    dbPath: "./test/database",
                    dbName: "restaurantManager" // by default generate random dbName
                }
            });
            // Async Trick - this ensures the database is created before
            // we try to connect to it or start the server
            await mongod.getConnectionString();

            mongoose.connect("mongodb://localhost:27017/restaurantManager", {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            server = require("../bin/www");
            db = mongoose.connection;
        } catch (error) {
            console.log(error);
        }
    });

    after(async () => {
        try {
            await db.dropDatabase();
            await mongod.stop()
            await server.close()
        } catch (error) {
            console.log(error);
        }
    });


    beforeEach(async () => {
        try {
            const order = new Order({
                billId: 1223,
                userId: "5db1fd86f7b46c3ac05d7632",
                starter: "cake",
                main: "ice-cream",
                desert: "cheesecake",
                drink: "coke",
                price: 25.99,
                payed: false,
                message: "5db1fd86f7c"
            });
            await order.save();
            const order1 = await Order.findOne({message: "5db1fd86f7c"});
            validID = order1.billId;

            const orders = new Order({
                billId: 1224,
                userId: "5db1fd86f7b46c3ac05d7632",
                starter: "cake",
                main: "ice-cream",
                desert: "cheesecake",
                drink: "coke",
                price: 25.99,
                payed: false,
                message: "5db1fd86f7b46c3ac05d7632a"
            });
            await orders.save();
            const orders2 = await Order.findOne({message: "5db1fd86f7b46c3ac05d7632a"});
            validID2 = orders2._id;
            //console.log(order1);
        } catch (err) {
            console.log(err)
        }
    });


    describe("GET /bill", () => {
        describe("when the id is valid", () => {
            try {
                it("should return the matching bill", done => {
                    try {
                        request(server)
                            .get(`/bill/${validID}/get`)
                            .set("Accept", "application/json")
                            .expect("Content-Type", /json/)
                            .expect(200)
                            .end((err, res) => {
                                try{
                                expect(res.body.message).equals("Bill found");
                                done(err);
                                }catch (error) {
                                    console.log(error);
                                }
                            });
                    }catch (error) {
                        console.log(error);
                    }
                });
            }catch (error) {
                    console.log(error);
                }
        });

        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                try{
                request(server)
                    .get("/bill/9999/get")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(404)
                    .end((err, res) => {
                        try{
                        expect(res.body.message).equals("Bill not found!");
                        done(err);
                        }catch (error) {
                            console.log(error);
                        }
                    });
                }catch (error) {
                    console.log(error);
                }
            });
        });
    });

    describe("DELETE /bill", () => {
        it("should delete an order", done => {

            try {
                request(server)
                    .delete(`/bill/${validID}/delete`)
                    .expect(200)
                    .expect("Content-Type", /json/)
                    .then(res => {
                        try {
                            expect(res.body).to.include({
                                message: "Bill Deleted!"
                            });
                            console.log("DELETE")
                         }catch (error) {
                    console.log(error);
                }
                    });

            } catch (err) {
                console.log("fail")
            }
            done();
        });
        after(() => {
            try{
            return request(server)
                .get(`/bill/${validID}/get`)
                .expect(404)
            }catch (error) {
                console.log(error);
            }
        });
    });

    describe("GET_TOTAL /bill", () => {
        it('should get the total price for a bill', done => {
        try{
            request(server)
                .get(`/bill/${validID}/total`)
                .expect(200)
                .expect("Content-Type", /json/)
                .then(res => {
                    try{
                        console.log({message:"what:",validID})
                    expect(res.body).to.include({
                        totalBill: 25.99
                    });
                    }catch (error) {
                        console.log(error);
                    }
                });
            done();
        }catch (error) {
        console.log(error);
        }
        });

        after(() => {
            try{
            return request(server)
                .get(`/bill/${validID}/get`)
                .expect(200)
            }catch (error) {
                console.log(error);
            }
        });


    });


    describe("UPDATE /bill", () => {

    });

    describe("PAY BILL OF ORDERS /bill", () => {
        describe("when the id is valid", () => {
            it('should return a message and paid true', () => {
                try {
                    return request(server)
                    .put(`/bill/${validID}/payBill`)
                    .expect(200)
                    .then(resp => {
                        try{
                        expect(resp.body).to.include({
                            message: "Bill Successfully Payed!"
                        });
                        }catch (error) {
                            console.log(error);
                        }
                        //expect(resp.body.data).to.have.deep.property('[0].payed', 'true');
                    });
                }catch (error) {
                    console.log(error);
                }
            });
            after(() => {
                try{
                return request(server)
                    .get(`/bill/${validID}/find`)
                    .expect(404)
                }catch (error) {
                    console.log(error);
                }
            });
        });
    });

    describe("UNPAY BILL OF ORDERS /bill", () => {
        describe("when the id is valid", () => {
            it('should return a message and paid false', () => {
                try{
                return request(server)
                    .put(`/bill/${validID}/unPayBill`)
                    .expect(200)
                    .then(resp => {
                        try{
                        expect(resp.body).to.include({
                            message: "Bill Set to unpaid!"
                        });
                        }catch (error) {
                            console.log(error);
                        }

                    });
                }catch (error) {
                    console.log(error);
                }
            });
            after(() => {
                try{
                return request(server)
                    .get(`/bill/${validID}/find`)
                    .expect(404)
                }catch (error) {
                    console.log(error);
                }
            });
        });
    });

});
