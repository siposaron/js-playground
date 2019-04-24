# Weather Provider
A NodeJS based javascript service providing weather related data based on location.

## Tech stack
NodeJS, Hapi, Mongoose, MongoDB

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
