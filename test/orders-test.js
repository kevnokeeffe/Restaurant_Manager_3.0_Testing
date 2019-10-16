const Order = require("../routes/orders");
const Index = require("../routes/index");

const order = new Order();

let id = 100001;
// Test findProductByName
let match = id.findOne(order,id);
if (match.id !== id) {
    console.log("find by id - Failed for valid id");
}

id = 999999;
match = id.findOne(order,id);
if (match !== null) {
    console.log("find by id - Failed when invalid id");
}