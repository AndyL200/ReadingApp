import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
//import { getUUIDFromToken } from './queries.js';
dotenv.config();


//express middleware
export const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || null
    if(!token) {
        res.sendStatus(401)
        return;
    }
    //make sure token that the user has isn't hashed
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        //what if signing in for the first time?
        if (err) {
            res.sendStatus(403)
            return;
        }
        req.user_id = decoded.user_id
        next()
    })

    

}


export const generateRefreshToken = (user = null) => {
    return jwt.sign({user_id: user?.id}, process.env.REFRESH_SECRET, {expiresIn: '7d'})
}

export const generateAccessToken = (user) => {
    return jwt.sign({user_id: user.id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}