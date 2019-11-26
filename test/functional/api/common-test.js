process.env.API_BASE = "/api";
const User = require("../../../models/users");
//let request = require('express');
export const chai = require("chai");
export const should = chai.should();
const expect = require('chai').expect;
let server;
const request = require('supertest');
let db, validID, validID2, inValidID;
inValidID = "5db1fd86f7b66c3ac55d7635";
const apiBase = process.env.API_BASE = "/api";




    const defaultUser = new User({ fName: "Kevin", lName: "O'Keeffe", email:"kevnokeeffe@gmail.com", password:"123456",permission: "admin",
        active: true });

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
        request(server)
            .post(apiBase + "/user/login")
            .send({ "email": user.email, "password": user.password })
            .expect(200);
    };


export const cleanExceptDefaultUser = async () => {
    let user = await getDefaultUser();
    await User.deleteMany({ "email": {$ne: user.email}});
};