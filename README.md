# Assignment 1 - Agile Software Practice.

Name: Kevin O'Keeffe (20074809)

## Overview.

The API of this project is for a Restaurant POS system. The objectives of this API is to provide the user with a CRUD ability for users, orders and bills. Also expanding on basic CRUD to provide added system capabilities. Such as individual value minipulation in a group of orders or users.

## API endpoints.

Order Endpoints:
~~~
 + GET /order/all - Get all orders.
 + GET /order/findOne/:id - Get one individual order.
 + DELETE /order/:id/delete - deletes a specific order.
 + POST /order/add - Add an order.
 + PUT order/payed/:id - set an order to payed.
 + PUT order/unpaid/:id - sets an order to unpaid.
 + PUT order/update/:id - update an order.
~~~
User Endpoints:
~~~
+ GET /user/:id/find - finds all the users.
+ GET /user/all - gets all the users.
+ PUT /user/:id/inactive - sets the users status to inactive.
+ PUT /user/:id/active - sets the users status to active.
+ PUT /user/add - adds a user to the database.
+ DELETE /user/:id/delete - deletes a user.
~~~
Bill Endpoints:
~~~
+ GET /bill/:billId/get - gets the orders attached to a certain bill.
+ GET /bill/:billId/total - gets the total cost of a bill.
+ PUT /bill/:billId/payBill - sets the status of all orders of a certain bill to payed.
+ PUT /bill/:billId/unPayBill - sets the status of all orders of a certain bill to unpayed.
+ GET /bill/unpaidBills/ - gives a list of unpayed bills.
+ GET /bill/paidBills/ - gives a list of payed bills.
+ GET /bill/totalRead/ - gives a list of total paid bills.
+ DELETE /bill/:billId/delete - deletes all orders attached to a certain bill.
~~~

## Data model.

The database contains two models. One for User and one for Order. Each User can have many orders but an order has only one user. A one to Many relationship.
Each user needs to have a unique email. The password is hashed using bcrypt and cannot be viewed. There is a boolean value assoicated with each user. Active is either true or false.
Each order is assiocated with a user and a bill. Orders can be grouped together by bills and their values minipulated as a bill. Such as delete all payed bills. An order has a boolean value called payed. 

User:
~~~
[
    {
          "_id": "5dbb3d8ce8324815b8f59938",
          "fName": "Kevin",
          "lName": "O Keeffe",
          "email": "kevaokeeffe@gmail.com",
          "password": "$2b$10$U1e7JYIBoS.Am8jFOtBvnOKcM46PiVcG/nepcF04me6eWtbglsZ9W",
          "active": true,
          "permission" : "admin"
    }
 ]
 ~~~
 Order:
 ~~~
 [
    {
          "_id": "5dbb299459305a2a6c1ce896",
          "billId": 1223,
          "userId": "5db1fd86f7b46c3ac05d7632",
          "starter": "cake",
          "main": "ice-cream",
          "desert": "cheesecake",
          "drink": "coke",
          "price": 25.99,
          "payed": false,
          "message": "5db1fd86f7c"
    }
 ]
 ~~~
## Sample Test execution.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Orders
    GET /orders

Successfully Connected to [ heroku_q1g0hzrw ] on users route
Successfully Connected to [ heroku_q1g0hzrw ] on orders route
Successfully Connected to [ heroku_q1g0hzrw ] on bills route

GET /order/all 200 943.195 ms - 85874
      √ should return all the orders (995ms)
    GET /order
      when the id is valid
GET /order/findOne/5dc0c11911368f096c96850d 200 6.588 ms - 385
        √ should return the matching order
      when the id is invalid
        √ should return the NOT found message
    POST /order
POST /order/add 201 35.404 ms - 243
      √ should return confirmation message and update datastore (42ms)
GET /order/findOne/5dc0c11a11368f096c968510 200 9.400 ms - 355
    DELETE /order/:id/delete
      When the id is valid
DELETE /order/5dc0c11a11368f096c968510/delete 200 4.967 ms - 68
        √ should delete an order
      when the id is invalid
        √ should return the NOT found message
    START PUT PAYED /order/payed/:id
      when the id is valid
PUT /order/payed/5dc0c11911368f096c96850d 200 14.926 ms - 39
        √ should return a message and the order set to payed: true
GET /order/findOne/5dc0c11911368f096c96850d 200 4.785 ms - 384
      when the id is invalid
        √ should return a Failed message
    START PUT UNPAYED /order/payed/:id
      when the id is valid
PUT /order/unpaid/5dc0c11911368f096c96850d 200 12.098 ms - 34
        √ should return a message and the order set to payed: false
      when the id is invalid
        √ should return a Failed message

  Bill
    GET /bill
      when the id is valid
GET /bill/1224/get 200 7.045 ms - 485
        √ should return the matching bill
      when the id is invalid
GET /bill/9999/get 404 2.985 ms - 40
        √ should return the NOT found message
    DELETE /bill
      when the id is valid
        √ should delete a the bill
DELETE /bill/1224/delete 200 9.320 ms - 68
GET /bill/1224/get 404 4.868 ms - 40
      when the id is invalid
        √ should return the NOT found message
    GET_TOTAL /bill/billId/total
      Total Bill
        √ should get the total price for a bill
GET /bill/1224/total 200 8.249 ms - 931
GET /bill/1224/get 200 7.466 ms - 935
      when the id is invalid
        √ should return a Failed message
    PAY BILL OF ORDERS /bill
      when the id is valid
PUT /bill/1224/payBill 200 13.777 ms - 76
        √ should return a message and paid true
GET /bill/1224/find 404 25.637 ms - 4059
      PAY BILL OF ORDERS
        √ should try set a bill to payed and fail
    UNPAY BILL OF ORDERS /bill
      when the id is valid
PUT /bill/1224/unPayBill 200 4.102 ms - 71
        √ should return a message and paid false
GET /bill/1224/find 404 3.101 ms - 4059
      UNPAY BILL OF ORDERS /order/:id/unpay
        √ should try and unpay a bill and fail

  Over Watch User
    ADD /user
      POST /user
POST /user/add 201 147.830 ms - 287
        √ should return confirmation message and update datastore (155ms)
GET /user/5dc0c11f11368f096c96852d/find 200 5.180 ms - 202
      Add an email that already belongs to an existing user
POST /user/add 409 3.038 ms - 42
        √ should return an invalid email message
      POST FAKE /user
POST /user/add 500 3.139 ms - 45
        √ should return an error message
    GET /user
GET /user/5dc0c11e11368f096c96852b/find 200 3.626 ms - 189
      √ should return the matching user
      when the id is invalid
        √ should return the NOT found message
GET /user/5dc0c11e11368f096c96852b/find 200 4.908 ms - 189
    DELETE /user
      DELETE_A_USER /user
        √ should delete a user
DELETE /user/5dc0c11f11368f096c96852d/delete 200 4.686 ms - 67
GET /user/5dc0c11f11368f096c96852d/find 200 4.865 ms - 2
      GET_INVALID_DELETE /users
        √ should try delete a user and fail
    GET_ALL /users
      GET /all
GET /user/all 200 9.330 ms - 3546
        √ should return all the users
    UPDATE_USER_ACTIVE //user/:id/active
      when the id is valid
PUT /user/5dc0c11e11368f096c96852b/active 200 4.501 ms - 76
        √ should return a message and the user set to active
      when the id is invalid
        √ should return a error message
    UPDATE_USER_INACTIVE /user/:id/inactive
      when the id is valid
PUT /user/5dc0c11e11368f096c96852b/inactive 200 3.305 ms - 78
        √ should return a message and the user set to inactive
      when the id is invalid
        √ should return a error message


  32 passing (9s)

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


## Extra features.

The added feature i would like to highlight would be the checking of a valid email. If one trys to create a user that has an email of an existing user the user creation will not take place. Also if one trys to create a user with an invalid email it will not alow it. Also hashing of the users password takes place using bcrypt. 


[datamodel]: ./img/sample_data_model.gif