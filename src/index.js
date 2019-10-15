const { ApolloServer, gql } = require('apollo-server')

const PORT = process.env.PORT || 5000;
// const schema = require("./graphql");
// const { checkUser, permissions } = require("./graphql/shield");

// const server = new GraphQLServer({
//   schema: schema,
//   middlewares: [permissions],
//   context: req => ({
//     ...req,
//     userLogged: checkUser(req)
//   })
// });

const serverOptions = {
  port: PORT
};

const { resolvers } = require('./resolvers')

const { getUserId } = require('./utils')

const typeDefs = gql`
  type Query {
    me: User!
  }
  type Mutation {
    signup(email: String, password: String): AuthPayload!
    login(email: String, password: String): AuthPayload!
  }
  type AuthPayload {
    token: String
  }
  type User {
    email: String
  }
`

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const userId = getUserId(req)
    return { ...req, userId }
  }
})

server.listen(serverOptions).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
