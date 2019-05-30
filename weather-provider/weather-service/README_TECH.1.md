# Initialize the project
`npm init -y`

`npm install hapi joi mongoose boom hapi-routes hapi-auth-jwt2 jsonwebtoken --save`

`npm install nodemon --save-dev`

Add a start server entry under package.json#scripts

`"start-local": "nodemon ./src/app.js"`


Later on we can specify environmental variables for startup i.e. 

`"start-local": "HOST=localhost MONGODB_URI=mongodb://localhost:27017/weather-service nodemon ./src/app.js"`


# Project structure
Create an `src` subfolder, it will store all the js source files and source subfolders.

|Location|Description|
|---|---|
|/src/app.js|the server file|
|/src/auth|the authorization helper|
|/src/config|the configurations|
|/src/models|the mongo specific models|
|/src/routes|the rest api routes|

# Code samples
## Hapi Server (app.js)

Basic server setup, change the Config.HOST, Config.PORT to hardcoded values, s.a. localhost, 3000
```
const Hapi = require('hapi');

const server = new Hapi.Server({  
    host: Config.HOST,
    port: Config.PORT
});  

async function start() { 
    try {
        await server.register([
            {
                plugin: require('hapi-routes'),
                options: {
                    dir: `${__dirname}/routes/*`,
                }
            }
        ]);
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('Server running at:', server.info.uri);
};

start();
```
Run `npm start-local` from project root folder.

## Create the mongo models with mongoose
Create the file `/src/models/user.js`
```
const Mongoose = require('mongoose'); 
module.exports = Mongoose.model("user", {
    name: String,
    email: String,
    password: String 
});
```
   
`/src/models/weather.js`
```
module.exports = Mongoose.model("weather", {
    user: String,
    location: String,
    temperature: Number,
    humidity: Number
});
```

## General Mongoose queries
* `MODEL.save()`
* `MODEL.find().exec()`
* `MODEL.findOne({}).exec()`
* `MODEL.findById(id).exec()`
* `MODEL.findByIdAndUpdate(id, {}, {new: true}).exec()`
* `MODEL.findByIdAndDelete(id).exec()`

## Accessing request parameters and body
* Header parameter: `request.headers.param_name`
* Path parameter: `request.params.param_name`
* Query string parameter: `request.query.param_name`
* Request body: `request.payload`
* Request body parameter: `request.payload.param_name`

## Create the users route (rest endpoint)
`src/routes/users.js`

```
const Boom = require('boom');  
const UserModel = require('../models/user');
const routes = [
    {
        method: 'POST',
        path: '/api/users',
        handler: async (request, h) => {
            try {
                const existing = await UserModel.findOne({
                    email: request.payload.email
                }).exec();

                if (existing) {
                    throw Boom.badImplementation('Email address already exists! Cannot create user.');    
                }

                const user = new UserModel(request.payload);
                const result = await user.save();
                return h.response(result);
            } catch (error) {
                throw Boom.badImplementation('Error while creating user.', error);
            }
        }
    }];

exports.routes = server => server.route(routes);
```

## Add mongo config to app.js
Add the lines below above the `async function start()` in app.js
```
// Mongo DB connection
Mongoose.connect(
    "mongodb://localhost:27017/weather-service", 
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
```   

> Write endpoint methods for GET, GET by id, UPDATE, DELETE.
