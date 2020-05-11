FROM node:alpine

WORKDIR /usr/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install && yarn cache clean

RUN apk update && apk add --no-cache supervisor bash

# Bundle app source
COPY . .

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

COPY supervisord.conf /etc/supervisord.conf
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
