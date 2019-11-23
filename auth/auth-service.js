// Authentication methods

export function requireLogin(req, res, next){
    const token= decodeToken(req);
    if(!token){
        return res.status(401).json({message: 'You must be logged in.'});
    }
    next();
}

export function decodeToken(req){
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

export function getEmail(req) {
    const token = decodeToken(req);
    if(!token){
        return null;
    }
    return token.user.email;
}

export function getUserId(req) {
    const token = decodeToken(req);
    if(!token){
        return null;
    }
    return token.user.id;
}

