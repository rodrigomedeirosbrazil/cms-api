FROM node:alpine

WORKDIR /usr/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install && yarn cache clean

RUN apk update && apk add --no-cache supervisor

# Bundle app source
COPY . .

COPY supervisord.conf /etc/supervisord.conf
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
