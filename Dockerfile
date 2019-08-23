# Define the docker hub image: https://hub.docker.com/_/node/
FROM node:alpine

WORKDIR /usr/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install && yarn cache clean

# Bundle app source
COPY . .

EXPOSE 5000
CMD [ "yarn", "start" ]
