const jwt = require('jsonwebtoken');
const config = require('../config');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token.split(' ')[1], config.secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
