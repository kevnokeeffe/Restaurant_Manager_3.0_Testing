const expect = require('chai').expect;
//const server = require("../bin/www");
const Order = require("../models/orders");
const request = require("supertest");
const _ = require("lodash");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const mongoose = require("mongoose");

let server;
let mongod;
let db, validID;

describe('Orders', () => {
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
            //await db.dropDatabase();
            await mongod.stop()
            await  server.close()
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
                message: "1217adce66bfa9e9e445c423643420af"
            });
            await order.save();
            const order1 = await Order.findOne({ message: "1217adce66bfa9e9e445c423643420af" });
            validID = order1._id;

        }catch(err){console.log(err)}
        });
    describe("GET /order", () => {
        it("should return all the orders", done => {
            try {
                request(server)
                    .get("/order/all")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        try {
                            expect(res.body).to.be.a("array");
                            expect(res.body.length).to.be.at.least(1);
                            expect(res.body.length).to.be.at.most(9999);
                            let value = _.map(res.body, order => {
                                return {
                                    main: order.main,
                                    desert: order.desert
                                };
                            });
                            expect(value).to.deep.include({
                                main: "ice-cream",
                                desert: "cheesecake"
                            });
                            done();
                        }catch (err) {
                            done(err)
                        }
                    });
            }catch(err){
                    console.log(err);
                    res.status(500).json({
                        message: "Get Order did not work!",
                        error: err
                    });
            }
        });
    });

    describe("POST /order", () => {
        it("should return confirmation message and update datastore", () => {
            const order = {
                billId: 1432,
                userId: "5db208ff6b6aaf09d8a9b361",
                starter: "Cake",
                main: "food",
                desert: "cheesecake",
                drink: "water",
                price: 23.99,
                payed: false,
                message: "String"
            };
            return request(server)
                .post("/order/add")
                .send(order)
                .expect(201)
                .then(res => {
                    expect(res.body.message).equals("Order Created");
                    validID = res.body.data._id;
                });
        });
        after(() => {
            return request(server)
                .get(`/order/findOne/${validID}`)
                .expect(200)
                .then(res => {
                    expect(res.body[0]).to.have.property("billId", 1432);
                    expect(res.body[0]).to.have.property("userId", "5db208ff6b6aaf09d8a9b361");
                    expect(res.body[0]).to.have.property("price", 23.99);
                });
        });
    });

    describe("DELETE /order", () => {
        it("should delete an order", done => {

            try {
                request(server)
                    .delete(`/order/${validID}/delete`)
                    .expect(200)
                    .expect("Content-Type", /json/)
                    .then(res => {
                        expect(res.body).to.be.a("array");
                        expect(res.body).to.include({
                            message: "Order Successfully Deleted!"
                        });

                        expect(res.body.data).to.include({
                            id: validID
                        });
                        console.log("DELETE")
                    });

            } catch (err) {
                console.log("fail")
            }
            done();
        });

        // after((done) => {
        //     request(server)
        //         .get(`/order/findOne/${validID}`)
        //         .set("Accept", "application/json")
        //         .expect("Content-Type", /json/)
        //         .expect(200)
        //         .end((err, res) => {
        //             expect(res.body).to.include({
        //                 message: "Order Not Deleted!"
        //
        //             })
        //             done(err);
        //             console.log("DELETE AFTER")
        //         });
        // });

        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .delete("/order/findOne/111111111")
                    .expect(404)
                    .expect({ message: "Order Not Deleted!" })
                console.log("Fake delete worked")
                done();
            });
        });
    });

    describe("GET /order", () => {
            describe("when the id is valid", () => {
                it("should return the matching order", done => {
                    request(server)
                        .get(`/order/findOne/${validID}`)
                        .set("Accept", "application/json")
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .end((err, res) => {
                            expect(res.body[0]).to.have.property("main", "ice-cream");
                            expect(res.body[0]).to.have.property("desert", "cheesecake");
                            done(err);
                        });
                });
            });
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .get("/order/findOne/9999")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Order NOT Found!");
                        done(err);
                    });
            });
        });
    });

    describe("UPDATE /order", () => {

    });

    describe("PUT /order/payed/:id", () => {
        describe("when the id is valid", () => {
            it("should return a message and the order set to payed: true", () => {
                return request(server)
                    .put(`/order/payed/${validID}`)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "Order Successfully Payed!"
                        });
                    });
            });
        });

        describe("when the id is invalid", () => {
            it("should return a message and the order set to payed: false", () => {
                return request(server)
                    .put(`/order/unpaid/${validID}`)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "Order Set to Unpaid!"
                        });
                    });
            });
        });
    });

});

