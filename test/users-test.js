const expect = require('chai').expect;
const request = require("supertest");
const _ = require("lodash");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const mongoose = require("mongoose");
const User = require("../models/users");
//const Order = require("../models/orders");

let server;

let mongod;

let db, validID;


const number = Math.floor(Math.random() * 10000) + 10000;

describe("User", () => {
    // it('should not timeout', (done) => {
    //     doLongThing().then(() => {
    //         done();
    //     });
    // }).timeout(5000);
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

    before(async () => {
        try {
            const user = new User({
                fName: "Kevin",
                lName: "O Keeffe",
                email: number+"@email.com",
                password: "123456",
                permission: "admin",
                active: true
            });
            await user.save();
            const user1 = await User.findOne({ userId: "5db208ff6b6aaf09d8a9b361" });
            validID = user1._id;
        } catch (error) {
            console.log(error)
        }
    });

    describe("GET /user/all", () => {
        it("should return all the users", done => {
            try {
                request(server)
                    .get('/user/all')
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        try {
                            expect(res.body).to.be.a("array");
                            expect(res.body.length).to.be.at.least(1);
                            expect(res.body.length).to.be.at.most(9999);
                            let result = _.map(res.body, user => {
                                return {
                                    fName: user.fName,
                                    lName: user.lName
                                };
                            });
                            expect(result).to.deep.include({
                                fName: "Kevin",
                                lName: "O Keeffe"
                            });
                            done();
                        } catch (err) {
                            done(err)
                        }
                    });
            } catch (err) {
                console.log({err,message:"error! get user did not work"});
                done(err);
            }
        });
    });


    describe("ADD /user", () => {

    });

    describe("DELETE /user", () => {

    });

    describe("GET /user", () => {
        describe("when the id is valid", () => {
            it("should return the matching user", done => {
                request(server)
                    .get(`/user/${validID}/find`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body[0]).to.have.property("fName", "Kevin");
                        expect(res.body[0]).to.have.property("lName", "O Keeffe");
                        done(err);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .get("/order/9999/find")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("User not found");
                        done(err);
                    });
            });
        });
    });

    describe("UPDATE /user", () => {

    });

});