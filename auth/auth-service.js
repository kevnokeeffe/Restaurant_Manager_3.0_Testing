let express = require('express');
let router = express.Router();

// Authentication methods

router.requireLogin = (req, res, next) => {
    const token= decodeToken(req);
    if(!token){
        return res.status(401).json({message: 'You must be logged in.'});
    }
    next();
}

router.decodeToken = (req) => {
    const token = req.headers.authorization || req.headers
        ['authenticate'];
    if (!token){
        return null;
    }
    try{
        return jwt.verify(token, process.env.secret);
    }catch (error){
        return null;
    }
}

router.getEmail= (req) => {
    const token = decodeToken(req);
    if(!token){
        return null;
    }
    return token.user.email;
}

router.getUserId = (req) => {
    const token = decodeToken(req);
    if(!token){
        return null;
    }
    return token.user.id;
}

module.exports = router
