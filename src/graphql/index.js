const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');

const UserSchema = require('./schema/User');
const AuthSchema = require('./schema/Auth');
const CustomerSchema = require('./schema/Customer');
const OrderSchema = require('./schema/Order');

const UserResolver = require('./resolvers/User');
const AuthResolver = require('./resolvers/Auth');
const CustomerResolver = require('./resolvers/Customer');
const OrderResolver = require('./resolvers/Order');

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

const resolvers = merge(
  UserResolver,
  AuthResolver,
  CustomerResolver,
  OrderResolver
);
const schema = makeExecutableSchema({
  typeDefs: [
    Query,
    Mutation,
    UserSchema,
    AuthSchema,
    CustomerSchema,
    OrderSchema
  ],
  resolvers: resolvers
});

module.exports = schema;
