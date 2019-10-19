const { GraphQLClient } = require('graphql-request')

require('dotenv').config()

module.exports = new GraphQLClient(process.env.ENDPOINT, {
  headers: {
    'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET
  }
})
