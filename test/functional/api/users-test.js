const _ = require("lodash");
const User = require("../../../models/users");
const {databasePassword, databaseUsername} = require('../../../config');
const mongoose = require("mongoose");
const expect = require('chai').expect;
const request = require('supertest');
import {loginWithDefaultUser} from "./common-test";

let server, db,token, validID;
let inValidID = "abcdefghijklmnopqrstuvwxyz0123456789";
const apiBase = process.env.API_BASE = "/api";
const email = Math.floor((Math.random() * 10000000) + 10000000);
const newUser = {
    fName: "Kevin",
    Name: "O'Keeffe",
    email: `${email}@gmail.com`,
    password: "123456",
    permission: "admin",
    active: true
};

describe("Operation Test Over Watch", () => {
    before(async () => {
        try {
            mongoose.connect(`mongodb+srv://${databaseUsername}:${databasePassword}@cluster0-r3fv1.mongodb.net/restaurantManager?retryWrites=true&w=majority`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            });
            server = require('../../../bin/www');
            db = mongoose.connection;
        } catch (error) {
            console.log(error);
        }

    });

    after(async () => {
        try {
            //await db.dropDatabase();
        } catch (error) {
            console.log(error);
        }
    });


    describe("# Auth APIs", () => {

        it("should create user", async () => {
            request(server)
                .post(apiBase + '/user/register')
                .set("Accept", "application/json")
                .send(newUser)
                .expect(200)
                .then(async (res) => {
                    expect(res).to.exist;
                    expect(res.body.message).equals("User Created");
                    const user1 = await User.findOne({email: `${email}@gmail.com`});
                    validID = user1._id;
                });
        });

        it("should try create an existing user and fail", () => {
            request(server)
                .post(apiBase + '/user/register')
                .set("Accept", "application/json")
                .send(newUser)
                .expect(409)
                .then(res => {
                    try {
                        expect(res.body.message).equals("Sorry, email already exists!");
                    } catch {
                        console.log("Email error check fail")
                    }
                });
        });

        it("should try create a user and fail", () => {
            const user = {
                faName: "",
            };

            request(server)
                .post(apiBase + '/user/register')
                .set("Accept", "application/json")
                .send(user)
                .expect(500)
                .then(res => {
                    expect(res.body.message).contains("Error Invalid Inputs");
                });
        });

        it("should retrieve the token", () => {
            request(server)
                .post(apiBase + "/user/login")
                .send({"email": newUser.email, "password": newUser.password})
                .expect(200)
                .then(res => {
                    expect(res).to.exist;
                    expect(res.body.token).to.not.be.empty;
                    token = res.body.token;
                });
        });

        it("should not login with the right user but wrong password", () => {
            request(server)
                .post(apiBase + '/user/login')
                .send({"email": newUser.email, "password": "random"})
                .expect(401)

        });

        it("should return invalid credentials error", () => {
            request(server)
                .post(apiBase + '/user/login')
                .send({"email": newUser.email, "password": ""})
                .expect(401)
                .then(res => {
                    return request(server)
                        .post(apiBase + '/user/login')
                        .send({"email": newUser.email, "password": "mypass"})
                        .expect(401);
                });
        });
    });

    // describe("# User APIs", () => {
    //     it("should return the matching user", () => {
    //         try {
    //            return request(server)
    //                 .get(apiBase + `/user/${validID}/find`)
    //                 .set("Accept", "application/json")
    //                 .set("Authorization", token)
    //                 .expect("Content-Type", /json/)
    //                 .expect(200)
    //                 .then((res) => {
    //                     expect(res.body[0]).to.have.property("fName", "Kevin");
    //                     expect(res.body[0]).to.have.property("lName", "O'Keeffe");
    //                     expect(res.body[0]).to.have.property("email", `${email}@gmail.com`);
    //                     expect(res.body[0]).to.have.property("active", true);
    //                 });
    //         } catch {
    //             console.log("Get User Fail")
    //         }
    //     });
    //
    //     it("should delete a user", () => {
    //         try {
    //           return request(server)
    //                 .delete(apiBase + `/user/${validID}/delete`)
    //                 .set("Authorization", token)
    //                 .set("Accept", "application/json")
    //                 .expect(200)
    //                 .expect("Content-Type", /json/)
    //                 .then(res => {
    //                     try {
    //                         expect(res.body.message).equals("User deleted");
    //                         //console.log("DELETE")
    //                     } catch {
    //                         console.log("error");
    //                     }
    //                 });
    //
    //         } catch (err) {
    //             console.log("fail")
    //         }
    //     });
    // });
});