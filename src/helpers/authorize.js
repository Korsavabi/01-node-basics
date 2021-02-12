import jwt from 'jsonwebtoken';
import { Unauthorized } from './error.constructors.js';

export function authorize(req, res, next) {
    
    const { token } = req.signedCookies;

    let uid;

    try{
        
        const playload = jwt.verify(token, process.env.JWT_SECRET);
        uid = playload.uid;
    }catch(err){
        return next(new Unauthorized('Token is not valid'));
    }

    req.userId = uid;
    next();
}