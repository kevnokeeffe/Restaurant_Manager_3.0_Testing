// const _ = require("lodash");
// export const chai = require("chai");
// export const should = chai.should();
// const {databasePassword, databaseUsername} = require('../../../config');
// const mongoose = require("mongoose");
// const expect = require('chai').expect;
// const request = require('supertest');
// let server, db;
// process.env.API_BASE = "/api";
//
// describe("Over Watch User", () => {
//     before(async () => {
// 		try {
// 			mongoose.connect(`mongodb+srv://${databaseUsername}:${databasePassword}@cluster0-r3fv1.mongodb.net/restaurantManager?retryWrites=true&w=majority`, {
// 				useNewUrlParser: true,
// 				useUnifiedTopology: true,
// 				useFindAndModify: false
// 			});
// 			server = require('../../../bin/www');
// 			db = mongoose.connection;
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	});
//
// 	after(async () => {
// 		try {
// 			await db.dropDatabase();
//             // await db.stop();
//             // await server.close()
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	});
//
// describe("# Auth APIs", () => {
//     const apiBase = process.env.API_BASE || '/api';
//     const newUser = {
//                         fName: "Kevin",
//                         Name: "O'Keeffe",
//                         email:"kevokeeffe@gmail.com",
//                         password:"123456",
//                         permission: "admin",
//                         active: true
//                     };
//
//     it("should create user", () => {
//           return request(server)
//                 .post(apiBase + '/user/login')
//                 .send(newUser)
//                 .expect(200)
//                 .then(res => {
//                     res.body.success.should.be.true;
//                 });
//
//     });

    // it("should retrieve the token", () => {
    //     return cleanExceptDefaultUser().then(res => {
    //         return loginWithDefaultUser().then(res => {
    //             res.status.should.equal(200);
    //             res.body.success.should.be.true;
    //             res.body.token.should.not.be.empty;
    //         });
    //     });
    // });
    //
    // it("should not login with the right user but wrong password", () => {
    //     return request.post(apiBase + '/user/login')
    //         .send({ "email": newUser.email, "password": "random" })
    //         .expect(401);
    // });
    //
    // it("should return invalid credentials error", () => {
    //     return request.post(apiBase + '/user/login')
    //         .send({ "email":  newUser.email, "password": "" })
    //         .expect(401)
    //         .then(res => {
    //             return request.post(apiBase + '/user/login')
    //                 .send({ "email":  newUser.email, "password": "mypas" })
    //                 .expect(401);
    //         });
    // });
// });
// });