let orders = require ('../models/orders');
let express = require('express');
let router = express.Router();

let message

message = "";

try{
    function getByValue(array,id){
        const result = array.filter(function(obj){return obj.id == id;});
        return result?result[0]:null;
    }
}catch(err){message = "Input is " + err;}

try{
    router.findOne = (req,res) => {
        const order = getByValue(orders, req.params.id);
        res.send(JSON.stringify(order,null,5));
        res.json(order);
    }
} catch (err){message = "Input is " + err;}

try {
    router.deleteOrder = (req, res) => {
        const order = getByValue(orders, req.params.id);
        const position = orders.indexOf(order);

        if (position !== -1)
            orders.splice(position, 1),
                res.json({message: 'Order Deleted'});
        else
            res.json({message: 'Order Not There!'});
    }
}catch (err){message = "Input is " + err;}

try { router.findAll = (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(orders, null, 5));
    } catch(err){ message = "Input is " + err;}
    finally {res.json(orders);
    }
}
} catch(err){ message = "Input is " + err;}

finally {
    module.exports = router;
}