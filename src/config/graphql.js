const { GraphQLClient } = require('graphql-request')

module.exports = new GraphQLClient(
  'http://127.0.0.1:8080/v1/graphql',
  {
    headers: {
      'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
    }
  }
)
