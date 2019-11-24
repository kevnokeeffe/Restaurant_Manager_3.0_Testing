process.env.API_BASE = "/api";

//const expect = require('chai').expect;
//const Order = require("../../../models/orders");
//const request = require("supertest");
//const _ = require("lodash");
//const UserTest = require("../../../controllers/user-control");

const User = require("../../../models/users");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const mongoose = require("mongoose");
export const request = require("supertest")(express);
export const chai = require("chai");
export const should = chai.should();

let server;
let mongod;
let db, validID, validID2, inValidID;
inValidID = "5db1fd86f7b66c3ac55d7635";





    const defaultUser = { "fName": "Kevin", "lName": "O'Keeffe", "email":"kevokeeffe@gmail.com", "password":"123456","permission": "admin",
        "active": true };

    const createUser = async () => {
        const UserModel = new User(defaultUser);
        await UserModel.save();
    };

    const getDefaultUser = async () => {
        let users = await User.find({ "email" : defaultUser.email });
        if (users.length === 0) {
            await createUser();
            return getDefaultUser();
        } else {
            return users[0];
        }
    };

    export const loginWithDefaultUser = async () => {
        let user = await getDefaultUser();
        return request.post(process.env.API_BASE + "/user/login")
            .send({ "email": defaultUser.email, "password": defaultUser.password })
            .expect(200);
    };


export const cleanExceptDefaultUser = async () => {
    let user = await getDefaultUser();
    await User.deleteMany({ "email": {$ne: user.email}});
};