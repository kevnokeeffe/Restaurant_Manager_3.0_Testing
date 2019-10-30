//const expect = require('chai').expect;
import { expect } from 'chai'
//import chaiSubset from 'chai-subset';
import Order from "../models/orders";
import request from "supertest";
//const _ = require("lodash");
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
            it("should return the matching bill", done => {
                request(server)
                    .get(`/bill/${validID}/get`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Bill found");
                        done(err);
                    });
            });
        });

        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .get("/bill/9999/get")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(404)
                    .end((err, res) => {
                        expect(res.body.message).equals("Bill not found!");
                        done(err);
                    });
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
                        expect(res.body).to.be.a("array");
                        expect(res.body).to.include({
                            message: "Bill Successfully Deleted!"
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
        after(() => {
            return request(server)
                .get(`/bill/${validID}/get`)
                .expect(404)
        });
    });

    describe("GET_TOTAL /bill", () => {
        it('should get the total price for a bill', done => {

            request(server)
                .get(`/bill/${validID}/total`)
                .expect(200)
                .expect("Content-Type", /json/)
                .then(res => {
                    expect(res.body).to.include({
                        price: 25.99
                    });
                });
            done();
        });
        after(() => {
            return request(server)
                .get(`/bill/${validID}/get`)
                .expect(200)
        });

    });


    describe("UPDATE /bill", () => {

    });

    describe("PAY and UNPAY BILL OF ORDERS /bill", () => {
        describe("when the id is valid", () => {
            it('should return a message and paid true', () => {
                return request(server)
                    .put(`/bill/${validID}/payBill`)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "Bill Successfully Payed!"
                        });

                        //expect(resp.body.data).to.have.deep.property('[0].payed', 'true');
                    });
            });
            after(() => {
                return request(server)
                    .get(`/bill/${validID}/find`)
                    .expect(404)
            });
        });



        describe("when the id is valid", () => {
            it('should return a message and paid false', () => {
                return request(server)
                    .put(`/bill/${validID}/unPayBill`)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "Bill Set to unpaid!"
                        });

                    });
            });
            after(() => {
                return request(server)
                    .get(`/bill/${validID}/find`)
                    .expect(404)
            });
        });
    });

});
