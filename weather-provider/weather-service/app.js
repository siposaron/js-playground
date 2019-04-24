'use strict';

const Hapi = require('hapi');
const Mongoose = require('mongoose');
const Authorizer = require('./auth/Authorizer');

// Create a server with a host and port
const server = new Hapi.Server({  
    host: 'localhost',
    port: process.env.PORT ? process.env.PORT : 3000
});  

// Mongo DB connection
Mongoose.connect(
    "mongodb://localhost:27017/weather-service", 
    { useNewUrlParser: true });

async function start() { 
    try {
        await server.register([
            {
                plugin: require('hapi-auth-jwt2')
            },
            {
                // routes plugin: fetch route files from directory
                plugin: require('hapi-routes'),
                options: {
                    dir: `${__dirname}/routes/*`,
                }
            }
        ]);

        server.auth.strategy('jwt', 'jwt', { 
            key: 's3cr3t',                  // secret key
            validate: Authorizer.validateToken,             // validate function defined above
            verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
        });
        
        server.auth.default('jwt');

        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();