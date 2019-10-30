const expect = require('chai').expect;
const Order = require("../models/orders");
const request = require("supertest");
const _ = require("lodash");
const UserTest = require("../controllers/user-control");
const User = require ("../models/users");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const mongoose = require("mongoose");
let server;
let mongod;
let db, validID;

describe("Over Watch", () =>{

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
        const user = new User({
            fName: "req.body.fName",
            lName: "req.body.lName",
            email: "kevinok@gmail.com",
            password: "123456",
            permission: "req.body.permission",
            active: true
        });
        await user.save();
        const user1 = await User.findOne({ permission: "req.body.permission" });
        validID = user1._id;

    }catch(err){console.log(err)}
});

describe("GET /user", () => {

});

describe("ADD /user", () => {
    describe("POST /user", () => {
        it("should return confirmation message and update datastore", () => {
            const user = {
                fName: "req.body.fName",
                lName: "req.body.lName",
                email: "kevinok2@gmail.com",
                password: "12345",
                permission: "req.body.permission",
                active: true
            };
            return request(server)
                .post("/user/add")
                .send(user)
                .expect(201)
                .then(res => {
                    expect(res.body.message).equals("User Created");
                    validID = res.body.data._id;

                });
            done();
        });
        after(() => {
            return request(server)
                .get(`/user/${validID}/find`)
                .expect(200)
                .then(res => {
                    expect(res.body[0]).to.have.property("fName", "req.body.fName");
                    expect(res.body[0]).to.have.property("lName", "req.body.lName");
                    expect(res.body[0]).to.have.property("email", "kevinok2@gmail.com");
                    expect(res.body[0]).to.have.property("active", true);
                });
        });
     });
 });

describe("DELETE /user", () => {

});

describe("GET_ALL /users", () => {

});

describe("UPDATE /user", () => {

});

});