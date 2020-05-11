const { GraphQLClient } = require('graphql-request')

module.exports = new GraphQLClient(process.env.ENDPOINT, {
  headers: {
    'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET
  }
})
