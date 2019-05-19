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