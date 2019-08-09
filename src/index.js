const { GraphQLServer } = require('graphql-yoga');
const path = require('path');
const resolvers = require('./resolvers');

const PORT = process.env.PORT || 5000;

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, 'schema.graphql'),
  resolvers
});

const serverOptions = {
  port: PORT
};

server.start(serverOptions, ({ port }) =>
  console.log(
    `Server started, listening on port ${port} for incoming requests.`
  )
);
