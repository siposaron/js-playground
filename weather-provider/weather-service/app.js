'use strict';

const Hapi = require('hapi');
const Mongoose = require('mongoose');

// Create a server with a host and port
const server = new Hapi.Server({  
    host: 'localhost',
    port: 3000
});  

Mongoose.connect(
    "mongodb://localhost:27017/weather-service", 
    { useNewUrlParser: true });

async function start() { 
    try {
        await server.register({
            plugin: require('hapi-routes'),
            options: {
                dir: `${__dirname}/routes/*`,
            }
        });
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();