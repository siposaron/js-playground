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