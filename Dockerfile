FROM node:alpine

WORKDIR /usr/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install && yarn cache clean

# Bundle app source
COPY . .

CMD [ "yarn", "start" ]
