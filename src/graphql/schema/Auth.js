module.exports = `
  extend type Query {
    isLogin: Boolean!
  }

  extend type Mutation {
    login(email: String!, password: String!): String!
  }
`;
