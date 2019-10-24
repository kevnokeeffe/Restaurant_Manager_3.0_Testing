const expect = require('chai').expect;
const server = require("../bin/www");
const Order = require("../models/orders");
const request = require("supertest");
const _ = require("lodash");

describe('Orders', () => {

    describe("GET_ALL /order/all", () => {
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
                                main: "chicken goujons",
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

    describe("GET_ONE /order/:id", () => {

    });

    describe("UPDATE /order", () => {

    });

});


