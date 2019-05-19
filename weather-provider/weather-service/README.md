# Weather Provider
A NodeJS based javascript service providing weather related data based on location.

## Tech stack
NodeJS, Hapi 18, Mongoose, MongoDB

## REST endpoints

### Public endpoints
Anyone can access wihout a valid token.

* POST /api/token

### Private endpoints
The request must contain a bearer JWT token.

Users:
* POST /api/users
* PUT /api/users/{id}
* GET /api/users
* GET /api/users/{id}
* DELETE /api/users/{id}

Weather:
* POST /api/weather
* PUT /api/weather/{id}
* GET /api/weather?location={city}
* GET /api/weather/{id}
* DELETE /api/weather/{id}

## Start the server
### Quick start
`npm run start-local`

### With environmental variables
| Name | Value |
| --- | --- |
| HOST | localhost |
| PORT | 3000 |
| MONGODB_URI | mongodb://localhost:27017/weather-service |
| SECRET_KEY | s3cr3t |

`HOST=localhost PORT=3000 MONGODB_URI=mongodb://localhost:27017/weather-service SECRET_KEY=s3cr3t node ./src/app.js`

## Register a user via CURL

`curl -X POST -H "Content-type: application/json" http://localhost:3000/api/users -d '{"name":"Scott Lang","email": "scott@lang.ant","password": "antman"}'`

## Step by step guide
See the [technical readme](README_TECH.md) for a step by step guide.