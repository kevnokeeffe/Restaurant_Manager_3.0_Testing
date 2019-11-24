const _ = require("lodash");
const chai = require("chai");
const should = require("chai").should;
const {databasePassword, databaseUsername} = require('../../../config');
const mongoose = require("mongoose");
const expect = require('chai').expect;
const request = require('supertest');
let server, db;
process.env.API_BASE = "/api";

describe("Over Watch User", () => {
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
        const apiBase = process.env.API_BASE || '/api';
        const newUser = {
            fName: "Kevin",
            Name: "O'Keeffe",
            email: "kevokeeffe@gmail.com",
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
                    expect(res.body.message).equals("User Created");;
                });

        });
    });
});