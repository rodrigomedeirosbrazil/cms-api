const { GraphQLServer } = require('graphql-yoga');

const PORT = process.env.PORT || 5000;
const schema = require('./graphql');
const { checkUser, permissions } = require('./graphql/shield');

const server = new GraphQLServer({
  schema: schema,
  middlewares: [permissions],
  context: req => ({
    ...req,
    userLogged: checkUser(req)
  })
});

const serverOptions = {
  port: PORT
};

server.start(serverOptions, ({ port }) =>
  console.log(
    `Server started, listening on port ${port} for incoming requests.`
  )
);
