# Initialize the project
`npm init -y`

`npm install hapi joi mongoose boom hapi-routes hapi-auth-jwt2 jsonwebtoken --save`

`npm install nodemon --save-dev`

Add a start server entry under package.json#scripts

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

`MODEL.save()`

`MODEL.find().exec()`

`MODEL.findOne({}).exec()`

`MODEL.findById(id).exec()`

`MODEL.findByIdAndUpdate(id, {}, {new: true}).exec()`

`MODEL.findByIdAndDelete(id).exec()`


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
    },
    {
        method: 'GET',
        path: '/api/users',
        handler: async (request, h) => {
            try {
                const result = await UserModel.find().exec();
                return h.response(result);
            } catch (error) {
                throw Boom.badImplementation('Error while fetching users.', error);
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/users/{id}',
        handler: async (request, h) => {
            try {
                await UserModel.findByIdAndDelete(request.params.id).exec();
                return h.response().code(204);
            } catch (error) {
                throw Boom.badImplementation('Error while deleting user.', error);
            }
        }
    }];

exports.routes = server => server.route(routes);
```

> Write endpoint methods for UPDATE, GET by id.

## Accessing request parameters and body
Header parameter: `request.headers.param_name`

Path parameter: `request.params.param_name`

Query string parameter: `request.query.param_name`

Request body: `request.payload`

Request body parameter: `request.payload.param_name`

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

## Add authorization mechanism
### JWT
JSON web token: what it is, why is it needed?

### Add the JWT plugin to the server config
```
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
```     

Need to write the validation method `Authorizer.validateToken` that should return either `{isValid : true}` or `{isValid : false}`

> How would you write it?

### Authorizer
We need the logic for generating tokens, and reading info from a token.

The `jsonwebtoken` module handles the:
* signing:
```
JWT.sign(user, 's3cr3t', { 
    algorithm: 'HS256',
    expiresIn: '1h'
});
```
* decoding:
```
JWT.verify(token.substring(7), 's3cr3t')
```

Create file `src/auth/authorizer.js`

```
const JWT = require('jsonwebtoken');
const UserModel = require('../models/user');

const generateToken = async function (user) {
    const token = JWT.sign(user, 's3cr3t', { 
        algorithm: 'HS256',
        expiresIn: '1h'
    });
    return token;
};

const validateToken = async function (decoded, request) {
    if (!decoded.email) {
        return { isValid: false };
    }
    else {
        const user = await UserModel.findById(decoded._id).exec();
        return user ? { isValid: true } : { isValid: false };
    }
};

const getUserId = async function (token) {
    const user = JWT.verify(token.substring(7), 's3cr3t');
    return user._id;
};


module.exports = {
    validateToken: validateToken,
    generateToken: generateToken,
    getUserId: getUserId
};

```

### Skip authorization for endpoints
> Which endpoints should be skipped of authorization?

Fetching token, Registering user

Create `/src/reoutes/token.js`
```
method: 'POST',
path: '/api/token',
options: {
    auth: false
},
handler: ...
```

Post the username, password, find user from DB and generate token for it.

Add `auth: false` to the /POST user endpoint in `users.js`, registering user is public.


## Weather endpoints
> Write endpoints for `weather` model. As an actor I'd like to see only my personal weather info. Search by location.

## Validate requests
Use `Joi` for validating requests in hapi routes.
You can validate `payload`, `query`, path `params`, `headers`.

Types: `string()`, `number()`, `array()`

Useful basic validations: `required()`, `min()`, `max()`, `email()`, `optional()`

```
const Joi = require('joi');
...
    method: 'POST',
    path: '/api/users',
    options: {
        auth: false,
        validate: {
            payload: {
                name: Joi.string().min(4).max(50).required(),
                email: Joi.string().email({ minDomainAtoms: 2 }).required(),
                password: Joi.string().required()
            },
            failAction: (request, h, error) => {
                throw Boom.badRequest('Invalid request parameter found.', error);
            }
        }
    }
    ...
```

> By now you should have the running app on localhost.

## Dockerize
### Create Dockerfile
Create the `Dockerfile` file in project root folder.
```
FROM mhart/alpine-node:latest

# Install bash and curl
RUN apk add --update bash && apk add curl && rm -rf /var/cache/apk/*

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY src ./

CMD [ "node", "app.js" ]
```

### Docker compose
Create the `docker-compose.yml` file in project root folder.
```
version: '3'
services:
  weather-service:
    build: .
    ports:
      - 3000:3000
    environment:
      - HOST=weather-service
      - PORT=3000
      - MONGODB_URI=mongodb://mongo/weather-service
      - SECRET_KEY=s3cr3t
    restart: always 
    depends_on: 
      - mongo  
  mongo:
    image: "mongo:latest"
    ports:
      - 37017:27017
    volumes:
      - mongo-config:/data/configdb
      - ~/Dev/Data/mongo-ws:/data/db
volumes:
#     mongo-data:
  mongo-config:
```

### Add configuration file
The app in docker is initialized via environmental variables.
Create a config file under `src/config/config.js`

```
module.exports = Object.freeze ({
    HOST: process.env.HOST,
    PORT: process.env.PORT ? process.env.PORT : 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    SECRET_KEY: process.env.SECRET_KEY ? process.env.SECRET_KEY : 's3cr3t'
});
```

And replace all hardcoded configs with `Config.HOST`, `Config.PORT` etc..

## Test
Use Postman (or Newman) and import the collection found [here](test/uflow-js-weather.postman_collection) for testing the endpoints.