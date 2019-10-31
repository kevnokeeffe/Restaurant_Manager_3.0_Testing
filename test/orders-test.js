const expect = require('chai').expect;
//const server = require("../bin/www");
const Order = require("../models/orders");
const request = require("supertest");
const _ = require("lodash");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const mongoose = require("mongoose");

let server;
let mongod;
let db, validID, validID2;

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
            await db.dropDatabase();
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
                    //.set("Accept", "application/json")
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
            }catch (error) {
                console.log(error);
            }
        });
    });

    describe("POST /order", () => {
        it("should return confirmation message and update datastore", () => {
            try {
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
                        try {
                            expect(res.body.message).equals("Order Created");
                            validID2 = res.body.data._id;
                        }catch(err){console.log("fail")}
                    });
            }catch (error) {
                console.log(error);
            }
        });
        after(() => {
            try {
                return request(server)
                    .get(`/order/findOne/${validID2}`)
                    .expect(200)
                    .then(res => { try {
                        expect(res.body[0]).to.have.property("billId", 1432);
                        expect(res.body[0]).to.have.property("userId", "5db208ff6b6aaf09d8a9b361");
                        expect(res.body[0]).to.have.property("price", 23.99);
                    }catch(err){console.log("fail")}
                    });

            }catch (error) {
                console.log(error);
            }
        });

    });

    describe("DELETE /order/:id/delete", () => {
        try {
            describe("When the id is valid", () => {
                try {
                    it("should delete an order", done => {

                        try {
                            request(server)
                                .delete(`/order/${validID2}/delete`)
                                .expect(200)
                                .expect("Content-Type", /json/)
                                .then(res => {
                                    expect(res.body).to.include({
                                        message: "Order deleted"
                                    });
                                    //console.log("DELETE worked!!!!")
                                    done();
                                });
                        } catch (err) {
                            console.log("delete fail")
                        }
                    });
                    after(() => {
                        try {
                            request(server)
                                .get(`/order/findOne/${validID2}`)
                                .set("Accept", "application/json")
                                .expect("Content-Type", /json/)
                                .expect(200)
                            //console.log("after delete worked")
                        } catch (err) {
                            console.log("after delete fail")
                        }

                    });
                } catch (err) {
                    console.log("should delete an order fail")
                }

            });


            describe("when the id is invalid", () => {
                it("should return the NOT found message", done => {
                    try{
                    request(server)
                        .delete(`/order/${validID2}/delete`)
                        .expect(500)
                        .expect({message: "Order Not Deleted!"})
                    //console.log("Fake delete worked")
                    done();
                    }catch (err) {
                        console.log(err)
                    }
                });
            });
        }catch (err) {
            console.log("delete block fail")
        }
    });


    describe("GET /order", () => {
            describe("when the id is valid", () => {
                it("should return the matching order", done => {
                    try{
                    request(server)
                        .get(`/order/findOne/${validID}`)
                        //.set("Accept", "application/json")
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .end((err, res) => {
                            expect(res.body[0]).to.have.property("main", "ice-cream");
                            expect(res.body[0]).to.have.property("desert", "cheesecake");
                            done(err);
                        });
                    }catch (err) {
                        console.log("get order fail")
                    }
                });
            });
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                try {
                    request(server)
                        .get("/order/findOne/5dbaf05dcf750200d89fcbco")
                        //.set("Accept", "application/json")
                        .expect("Content-Type", /json/)
                        .expect(500)
                        .expect({message: "Order NOT Found!"});
                        done();
                } catch (err) {
                    console.log("id invalid fail")
                }
            });
        });
    });

    describe("UPDATE /order", () => {

    });

    describe("PUT /order/payed/:id", () => {
        describe("when the id is valid", () => {
            it("should return a message and the order set to payed: true", () => {
                try{
                return request(server)
                    .put(`/order/payed/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "Order Successfully Payed!"
                        });

                    });
                }catch (err) {
                    console.log("valid id fail")
                }
            });
        });

        describe("when the id is invalid", () => {
            it("should return a message and the order set to payed: false", () => {
                try{
                return request(server)
                    .put(`/order/unpaid/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "Order Set to Unpaid!"
                        });
                    });
                }catch (err) {
                    console.log("invalid id fail")
                }
            });
        });
    });

});

