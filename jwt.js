const jwt = require('jsonwebtoken');

const jwtMiddelWare = (req, res, next) => {
    // chech header req
    const authorization = req.headers.authorization
    if (!authorization)
        return res.status(401).json({ error: 'token not found' });

    // extract the jwt token
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: "unauthorized" })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next();

    }
    catch (err) {
        console.error(err)
        res.status(401).json({ error: "invalid token" })

    }

}

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 30000 });
}
module.exports = { jwtMiddelWare, generateToken }