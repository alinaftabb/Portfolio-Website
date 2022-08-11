const jwt = require('jsonwebtoken');
const config = require('config');
const Users = require('../models/Users');

module.exports = (req, res, next) => {
    //Get token from header
    const token = req.header('x-auth-token');

    //Check if not token
    if (!token) return res.status(401).send({
        msg: 'No token, authorization denied'
    });

    //Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).send({
            msg: 'Token is not valid'
        });
    }
};