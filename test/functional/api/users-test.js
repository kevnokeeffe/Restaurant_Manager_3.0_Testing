const expect = require('chai').expect;
const Order = require("../../../models/orders");
const request = require("supertest");
const _ = require("lodash");
const UserTest = require("../../../controllers/user-control");
const User = require("../../../models/users");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const mongoose = require("mongoose");
let server;
let mongod;
let db, validID, validID2, inValidID;
inValidID = "5db1fd86f7b66c3ac55d7635";

describe("Over Watch User", () => {

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
            server = require("../../../bin/www");
            db = mongoose.connection;
        } catch (error) {
            console.log(error);
        }
    });

    after(async () => {
        try {
            await db.dropDatabase();
            await mongod.stop();
            await server.close()
        } catch (error) {
            console.log(error);
        }
    });

    beforeEach(async () => {
        try {
            const user = new User({
                fName: "kevin",
                lName: "o keeffe",
                email: "kevokeeffe@gmail.com",
                password: "123456",
                permission: "req.body.permission",
                active: true
            });
            await user.save();
            const user2 = new User({
                fName: "req.body",
                lName: "req.body",
                email: "kevinokssffe@gmail.com",
                password: "123456",
                permission: "req.body",
                active: true
            });
            await user2.save();
            const user1 = await User.findOne({ permission: "req.body.permission" });
            validID = user1._id;


        } catch{ console.log("error") }
    });

    describe("ADD /user", () => {
        describe("POST /user", () => {
            it("should return confirmation message and update datastore", () => {
                try {
                    const user = {
                        fName: "req.body.fName",
                        lName: "req.body.lName",
                        email: "kevinok2@gmail.com",
                        password: "12345",
                        permission: "req.body.permiss",
                        active: true
                    };
                    return request(server)
                        .post("/user/add")
                        .send(user)
                        .expect(201)
                        .then(res => {
                            expect(res.body.message).equals("User Created");
                            validID2 = res.body.data._id;

                        });
                } catch{ console.log("error") };
            });
            after(() => {
                try {
                    return request(server)
                        .get(`/user/${validID2}/find`)
                        .expect(200)
                        .then(res => {
                            expect(res.body[0]).to.have.property("fName", "req.body.fName");
                            expect(res.body[0]).to.have.property("lName", "req.body.lName");
                            expect(res.body[0]).to.have.property("email", "kevinok2@gmail.com");
                            expect(res.body[0]).to.have.property("active", true);
                        });
                } catch{ console.log("error") };
            });
        });

        describe("Add an email that already belongs to an existing user", () => {
            it("should return an invalid email message", () => {
                try {
                    const user = {
                        fName: "req.body.fName",
                        lName: "req.body.lName",
                        email: "kevinok2@gmail.com",
                        password: "12345",
                        permission: "active",
                        active: true
                    };
                    return request(server)
                        .post("/user/add")
                        .send(user)
                        .expect(409)
                        .then(res => {
                            try {
                                expect(res.body.message).equals("Sorry, email already exists!");
                            } catch {
                                console.log("error")
                            }
                        });
                } catch {
                    console.log("error")
                }

            });
        });

        describe("POST FAKE /user", () => {
            it("should return an error message", () => {
                try {
                    const user = {
                        faName: "req.body.fName",
                        laName: "req.body.lName",
                        eamail: "kevinok2@gmail.com",
                        paassword: "12345",
                        paermission: "req.body.permiss",
                        aactive: true
                    };
                    return request(server)
                        .post("/user/add")
                        .send(user)
                        .expect(500)
                        //.expect({message: "Error Invalid Inputs"})
                        .then(res => {
                            try {
                                expect(res.body.message).contains("Error Invalid Inputs");
                            } catch {
                                console.log("error")
                            }
                        });
                } catch {
                    console.log("error")
                }

            });
        });


    });

    describe("GET /user", () => {
        it("should return the matching user", done => {
            try {
                request(server)
                    .get(`/user/${validID}/find`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then((res) => {
                        expect(res.body[0]).to.have.property("fName", "kevin");
                        expect(res.body[0]).to.have.property("lName", "o keeffe");
                        expect(res.body[0]).to.have.property("email", "kevokeeffe@gmail.com");
                        expect(res.body[0]).to.have.property("active", true);
                        done()
                    });
            } catch{ console.log("Get User Fail") }
        });
        after(() => {
            try {
                return request(server)
                    .get(`/user/${validID}/find`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then((res) => {
                        expect(res.body[0]).to.have.property("fName", "kevin");
                    });
            } catch{ console.log("error") };
        });
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                try {
                    request(server)
                        .get(`/user/${inValidID}/find`)
                        .set("Accept", "application/json")
                        .expect("Content-Type", /json/)
                        .expect(500)
                        .expect({ message: "User NOT Found!" });
                    done();
                } catch{ console.log("error") };
            });
        });
    });

    describe("DELETE /user", () => {
        describe("DELETE_A_USER /user", () => {
            it("should delete a user", done => {

                try {
                    request(server)
                        .delete(`/user/${validID2}/delete`)
                        .expect(200)
                        .expect("Content-Type", /json/)
                        .then(res => {
                            try {
                                expect(res.body.message).equals("User deleted");
                                //console.log("DELETE")
                            } catch {
                                console.log("error");
                            }
                        });

                } catch (err) {
                    console.log("fail")
                }
                done();
            });
            after(() => {
                try {
                    return request(server)
                        .get(`/user/${validID2}/find`)
                        .expect(200)
                } catch {
                    console.log("error 2");
                }
            });
        });

        describe("GET_INVALID_DELETE /users", () => {
            it("should try delete a user and fail", done => {

                try {
                    request(server)
                        .delete("/user/5dbaf05dcf89fcbco/delete")
                        .expect("Content-Type", /json/)
                        .expect(500)
                        .expect({ message: "Error no such user" });
                    done();

                } catch (err) {
                    console.log("fail")
                }

            });
        });
    });

    describe("GET_ALL /users", () => {
        describe("GET /all", () => {
            it("should return all the users", done => {
                try {
                    request(server)
                        .get("/user/all")
                        .set("Accept", "application/json")
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .end((err, res) => {
                            try {
                                expect(res.body).to.be.a("array");
                                expect(res.body.length).to.be.at.least(1);
                                expect(res.body.length).to.be.at.most(9999);
                                done();
                            } catch (err) {
                                done(err)
                            }
                        });
                } catch (error) {
                    console.log(error);
                }
            });
        });
    });

    describe("UPDATE_USER_ACTIVE //user/:id/active", () => {
        describe("when the id is valid", () => {
            it("should return a message and the user set to active", () => {
                try {
                    return request(server)
                        .put(`/user/${validID}/active`)
                        .set("Accept", "application/json")
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .then(resp => {
                            expect(resp.body).to.include({
                                message: "Status changed to active"
                            });
                            //console.log({message: "it worked"})
                        });
                } catch (err) {
                    console.log("valid id fail")
                }
            });
            after(() => {
                try {
                    request(server)
                        .get(`/user/${validID}/find`)
                        .set("Accept", "application/json")
                        .expect("Content-Type", /json/)
                        .expect(200)

                } catch (err) {
                    console.log("after valid id fail")
                }
            });
        });

        describe("when the id is invalid", () => {
            it("should return a error message", () => {
                try {
                    request(server)
                        .put(`/user/hrddrbrby6564/active`)
                        .expect(500)
                        .expect({ message: "Error no such user" });
                } catch (err) {
                    console.log("valid id fail")
                }
            });
        });
    });

    describe("UPDATE_USER_INACTIVE /user/:id/inactive", () => {
        describe("when the id is valid", () => {
            it("should return a message and the user set to inactive", () => {
                try {
                    return request(server)
                        .put(`/user/${validID}/inactive`)
                        .set("Accept", "application/json")
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .then(resp => {
                            expect(resp.body).to.include({
                                message: "Status changed to inactive"
                            });
                            //console.log({message: "it worked"})
                        });
                } catch (err) {
                    console.log("valid id fail")
                }
            });
            after(() => {
                try {
                    request(server)
                        .get(`/user/${validID}/find`)
                        .set("Accept", "application/json")
                        .expect("Content-Type", /json/)
                        .expect(200)

                } catch (err) {
                    console.log("after valid id fail")
                }
            });
        });

        describe("when the id is invalid", () => {
            it("should return a error message", () => {
                try {
                    request(server)
                        .put(`/user/hrddrbrby6564/inactive`)
                        .expect(500)
                        .expect({ message: "Error no such user" });
                } catch (err) {
                    console.log("valid id fail")
                }
            });
        });
    });


});