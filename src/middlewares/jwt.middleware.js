const jwt = require("jsonwebtoken");

const JwtMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch(err) {
        next();
    }
}

module.exports = JwtMiddleware;