FROM mhart/alpine-node:latest

# Install bash
RUN apk add --update bash && rm -rf /var/cache/apk/* && apk add curl

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY src ./

CMD [ "node", "app.js" ]