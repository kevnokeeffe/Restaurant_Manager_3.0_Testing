const expect = require('chai').expect;
const server = require("../bin/www");
const orders = require("../models/orders");
const request = require("supertest");
const _ = require("lodash");


describe('Orders', () => {

    describe("GET /order", () => {
        it("should return all the donations", done => {
            request(server)
                .get("/order/all")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.a("array");
                    //expect(res.body.length).to.equal(2);
                    done(err);
                });
        });
    });

    describe("ADD /order", () => {

    });

    describe("DELETE /order", () => {

    });

    describe("GET_ALL /order", () => {

    });

    describe("UPDATE /order", () => {

    });

});
