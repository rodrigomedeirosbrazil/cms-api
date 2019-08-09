const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');

const UserSchema = require('./schema/User');
const UserResolver = require('./resolvers/User');

const resolvers = {};
const schema = makeExecutableSchema({
  typeDefs: [UserSchema],
  resolvers: merge(resolvers, UserResolver)
});

module.exports = schema;
