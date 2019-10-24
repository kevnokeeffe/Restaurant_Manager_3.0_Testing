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
                message: "i like sweet things"
            });
            await order.save();
            const order1 = await Order.findOne({ userId: "5db1fd86f7b46c3ac05d7632" });
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

    describe("ADD /order", () => {

    });

    describe("DELETE /order", () => {

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

});

