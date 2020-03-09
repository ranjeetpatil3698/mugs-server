const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

module.exports.generateLoginToken = (user, tokenExp) => {
    var u = {
        _id: user._id
    };

    return token = jwt.sign(u, process.env.TOKEN_SECRET, {
        expiresIn: tokenExp
    });
};

module.exports.generateTestLimitToken = (user, tokenExp) => {

    var u = {
        _id: user._id
    };

    return token = jwt.sign(u, process.env.TOKEN_SECRET, {
        expiresIn: tokenExp
    });
};

module.exports.hash = function(password, callback) {
    let saltRounds = 10
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            callback(err, hash);
        });
    });
};

module.exports.check = (password, hash, callback) => {
    bcrypt.compare(password, hash, (error, check) => {
        callback(error, check);
    })
}