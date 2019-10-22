const expect = require('chai').expect;
const orders = require("../models/orders");
const request = require("supertest");
const _ = require("lodash");


describe("GET /order", () => {

});

describe("ADD /order", () => {

});

describe("DELETE /order", () => {

});

describe("GET_ALL /order", () => {

});

describe("UPDATE /order", () => {

});

// before(() => {
//
//     Order.push({
//         _id: 1000001,
//         billId: 1001,
//         userId: 100123,
//         starter: "salad",
//         main: "beef",
//         desert: "cake",
//         drink: "coke",
//         price: 25.99,
//         payed: false,
//         message: "A message"
//     });
//
//     it("should return all the donations", done => {
//         request(server)
//             .get("/order/all")
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect(200)
//             .end((err, res) => {
//                 expect(res.body).to.be.a("array");
//                 //expect(res.body.length).to.equal(2);
//                 const result = _.map(res.body, order => {
//                     return {
//                         _id: 1000001,
//                         billId: 1001,
//                         userId: 100123,
//                         starter: "salad",
//                         main: "beef",
//                         desert: "cake",
//                         drink: "coke",
//                         price: 25.99,
//                         payed: false,
//                         message: "A message"
//                     };
//                 });
//                 expect(result).to.deep.include({
//                     billId: 1001,
//                     userId: 100123,
//                     starter: "salad",
//                     main: "beef",
//                     desert: "cake",
//                     drink: "coke",
//                     price: 25.99,
//                     payed: false,
//                     message: "A message"
//                 });
//                 //expect(result).to.deep.include({id: 1000001, amount: 1100});
//                 done(err);
//                 console.log("GET")
//             });
//     });
// });
// });
