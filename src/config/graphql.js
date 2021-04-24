const { GraphQLClient } = require('graphql-request')

const ENDPOINT = process.env.ENDPOINT || 'http://127.0.0.1:8080/v1/graphql'
const HASURA_GRAPHQL_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET || '123456789'
module.exports = new GraphQLClient(
  ENDPOINT,
  {
    headers: {
      'X-Hasura-Admin-Secret': HASURA_GRAPHQL_ADMIN_SECRET
    }
  }
)
