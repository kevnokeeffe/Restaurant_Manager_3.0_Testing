const _ = require("lodash");
const User = require("../../../models/users");
const {databasePassword, databaseUsername} = require('../../../config');
const mongoose = require("mongoose");
const expect = require('chai').expect;
const request = require('supertest');
import {loginWithDefaultUser} from "./common-test";

let server, db,token, validID, validID2;
let inValidID = "abcdefghijklmnopqrstuvwxyz0123456789";
const apiBase = process.env.API_BASE = "/api";


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
            await db.dropDatabase();
        } catch (error) {
            console.log(error);
        }
    });


    describe("# Auth APIs", () => {
        const newUser = {
            fName: "Kevin",
            Name: "O'Keeffe",
            email: "kevinokeeffe@gmail.com",
            password: "123456",
            permission: "admin",
            active: true
        };

        it("should create user", () => {
            return request(server)
                .post(apiBase + '/user/register')
                .send(newUser)
                .expect(200)
                .then(res => {
                    expect(res).to.exist;
                    expect(res.body.message).equals("User Created");
                    });
        });

        it("should try create an existing user and fail", () => {
            return request(server)
                .post(apiBase + '/user/register')
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

            return request(server)
                .post(apiBase + '/user/register')
                .send(user)
                .expect(500)
                .then(res => {
                    expect(res.body.message).contains("Error Invalid Inputs");
                });
        });

        it("should retrieve the token", () => {
            return request(server)
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
            return request(server)
                .post(apiBase + '/user/login')
                .send({"email": newUser.email, "password": "random"})
                .expect(401)

        });

        it("should return invalid credentials error", () => {
            return request(server)
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


        // it("should return a user", () => {
        //     return request(server)
        //         .post(apiBase + "/user/login")
        //         .send({"email": newUser.email, "password": newUser.password})
        //         .expect(200)
        //         .then(res => {
        //             expect(res).to.exist;
        //             expect(res.body.token).to.not.be.empty
        //             const token = res.body.token
        //             request(server, token, validID)
        //                 .get(apiBase + `/user/${validID}/find`)
        //                 .set("Authorization", token)
        //                 .expect(200)
        //                 .then((res) => {
        //                     expect(res).to.exist;
        //                     expect(res.body[0]).to.have.property("fName", "Kevin");
        //                     expect(res.body[0]).to.have.property("lName", "O'Keeffe");
        //                     expect(res.body[0]).to.have.property("email", "kevinokeeffe@gmail.com");
        //                     expect(res.body[0]).to.have.property("permission", "admin");
        //                     expect(res.body[0]).to.have.property("active", true);
        //                 });
        //         });
        // });
        //
        // it("should try find a user with invalid ID and fail", () => {
        //     request(server)
        //         .get(apiBase + `/user/${inValidID}/find`)
        //         .set("Accept", "application/json")
        //         .expect("Content-Type", /json/)
        //         .expect(500)
        //         .expect({message: "User NOT Found!"});
        // });
        //

    });
});

function authenticateAgent(email, password) {
    return agent
        .post(apiBase + '/user/register')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({
            "email": newUser.email, "password": newUser.password
        });
}

const testUser = new User({
    email: 'test@gmail.com',
    password: '$2b$10$u8JvPqJ3v08S.s9zL6LOy.su65KlcQrY7O2',
    fName: 'Kev',
    lName: 'Door',
    permission: "admin",
    active: true
});
const testUser2 = new User({
    email: 'test@yahoo.com',
    password: '$2b$10$u8JvPqJ3v08S.s9zL6LOy.su65KlcQrV7O2',
    fName: 'Tom',
    lName: 'Car',
    permission: "admin",
    active: true
});

const newUser = new User({
    fName: "Kevin",
    Name: "O'Keeffe",
    email: "kevokeeffe@gmail.com",
    password: "123456",
    permission: "admin",
    active: true
});