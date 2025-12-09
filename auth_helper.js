import jwt from 'jsonwebtoken';


//express middleware
export const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || null
    if(!token) {
        res.sendStatus(401)
        return;
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        //what if signing in for the first time?
        if (err) {
            res.sendStatus(403)
            return;
        }
        req.user = decoded.user_id
        next()
    })

    

}


export const generateRefreshToken = (user = null) => {
    return jwt.sign({user_id: user?.id}, process.env.REFRESH_SECRET, {algorithm: "RS512", expiresIn: '7d'})
}

export const generateAccessToken = (user) => {
    return jwt.sign({user_id: user.id}, process.env.ACCESS_TOKEN_SECRET, {algorithm: "RS512", expiresIn: '15m'})
}