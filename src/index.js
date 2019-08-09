const { GraphQLServer } = require('graphql-yoga');
const schema = require('./graphql');
const PORT = process.env.PORT || 5000;

const server = new GraphQLServer({ schema: schema });

const serverOptions = {
  port: PORT
};

server.start(serverOptions, ({ port }) =>
  console.log(
    `Server started, listening on port ${port} for incoming requests.`
  )
);
