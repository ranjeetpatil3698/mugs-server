const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_APIKEY)

module.exports.jwtToken = (payload) => {
    let secret = process.env.TOKEN_SECRET
    let token = jwt.sign(payload, secret, {
        expiresIn: "7 days"
    });
    return token;
};

module.exports.hash = function (password, callback) {
    let saltRounds = Number(process.env.SALT_ROUND)
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            callback(err, hash);
        });
    });
};

module.exports.check = (password, hash, callback) => {
    bcrypt.compare(password, hash, (error, check) => {
        callback(error, check);
    })
}

module.exports.mail = (message) => {
    sgMail.send(message)
}


module.exports.authenticateMiddleware = (req, res, next) => {
    let token = req.headers['x-access-token']
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
            if (err) {
                return res.status(401).json({ error: err, success: false, message: "Failed to authenticate token", tokenAutorization: false });
            } else {
                req.decoded = decoded;
                next();
            }
            });
    } else {
        return res.status(403).send({
            success: false,
            message: "no token provided"
        });
    }
}
