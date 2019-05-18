const JWT = require('jsonwebtoken');
const UserModel = require('../models/user');
const Config = require('../config/config');

const generateToken = async function (user) {
    console.log("USER: ", user);

    const token = JWT.sign(user, Config.SECRET_KEY, { 
        algorithm: 'HS256',
        expiresIn: '1h'
    });

    console.log("TOKEN: ", token);
    return token;
};

const validateToken = async function (decoded, request) {
    console.log("Decoded: ", decoded);
    if (!decoded.email) {
        return { isValid: false };
    }
    else {
        const user = await UserModel.findById(decoded._id).exec();
        return user ? { isValid: true } : { isValid: false };
    }
};

const getUserId = async function (token) {
    const user = JWT.verify(token.substring(7), Config.SECRET_KEY);
    return user._id;
};


module.exports = {
    validateToken: validateToken,
    generateToken: generateToken,
    getUserId: getUserId
};
