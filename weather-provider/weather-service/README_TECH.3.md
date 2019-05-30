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