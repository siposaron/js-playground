'use strict';
const Mongoose = require('mongoose'); 

module.exports = Mongoose.model("user", {
    name: String,
    email: String,
    password: String 
});