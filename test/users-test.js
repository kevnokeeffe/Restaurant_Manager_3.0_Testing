const expect = require('chai').expect;
const server = require("../bin/www");
const User = require("../models/users");
const request = require("supertest");
const _ = require("lodash");



describe("User", () => {

    beforeEach(async () => {
        try {
            let user = new User({
                fName: "Kevin",
                lName: "O Keeffe",
                email: "email@email.com",
                password: "123456",
                permission: "admin",
                active: true
            });
            await user.post();
        } catch (error) {
            console.log(error)
        }
    });

    describe("GET /user/all", () => {
        it("should return all the users", done => {
            try {
                request(server)
                    .get("/user/all")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        try {
                            //res.headers["content-type"].should.contains('application/json');
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
                console.log(err);
                res.status(500).json({
                    message: "Get User did not work!",
                    error: err
                });
            }
        });
    });


    describe("ADD /user", () => {

    });

    describe("DELETE /user", () => {

    });

    describe("GET_ALL /users", () => {

    });

    describe("UPDATE /user", () => {

    });

});