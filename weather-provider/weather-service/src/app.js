'use strict';

const Hapi = require('hapi');
const Mongoose = require('mongoose');
const Authorizer = require('./auth/Authorizer');

// Create a server with a host and port
const server = new Hapi.Server({  
    host: process.env.HOST,
    port: process.env.PORT ? process.env.PORT : 3000
});  

// Mongo DB connection
Mongoose.connect(
    // "mongodb://localhost:27017/weather-service", 
    process.env.MONGODB_URI,
    { 
        useNewUrlParser: true,
        // Automatically try to reconnect when it loses connection to MongoDB
        autoReconnect: true,
        // Never stop trying to reconnect
        reconnectTries: Number.MAX_VALUE,
        // Reconnect every 500ms
        reconnectInterval: 500,
        // Maintain up to 10 socket connections. If not connected,
        // return errors immediately rather than waiting for reconnect
        poolSize: 10,
        // Give up initial connection after 10 seconds
        connectTimeoutMS: 10000
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });

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