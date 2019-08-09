const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');

const UserSchema = require('./schema/User');
const CustomerSchema = require('./schema/Customer');

const UserResolver = require('./resolvers/User');
const CustomerResolver = require('./resolvers/Customer');

const Query = `
  type Query {
    _empty: String
  }
`;

const Mutation = `
  type Mutation {
    _empty: String
  }
`;

const resolvers = merge(UserResolver, CustomerResolver);
const schema = makeExecutableSchema({
  typeDefs: [Query, Mutation, UserSchema, CustomerSchema],
  resolvers: resolvers
});

module.exports = schema;
