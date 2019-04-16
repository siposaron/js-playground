'use strict';
const Mongoose = require('mongoose'); 

module.exports = Mongoose.model("weather", {
    user: String,
    location: String,
    temperature: Number,
    humidity: Number
});