const expect = require('chai').expect;
const Order = require("../models/orders");
const request = require("supertest");
const _ = require("lodash");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const mongoose = require("mongoose");

let server;
let mongod;
let db, validID;
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
                message: "5db1fd86f7b46c3ac05d7632"
            });
            await order.save();
            const order1 = await Order.findOne({message: "5db1fd86f7b46c3ac05d7632"});
            validID = order1.billId;

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
                .expect(500)
                .end((err, res) => {
                    expect(res.body.message).equals("Bill not found!");
                    done(err);
                });
        });
    });
    });

    describe("DELETE /bill", () => {

    });

    describe("GET_TOTAL /bill", () => {

    });

    describe("UPDATE /bill", () => {

    });
});
