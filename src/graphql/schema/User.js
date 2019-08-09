module.exports = `
  type User {
      id: ID!
      name: String!
      email: String!
      password: String!
      active: Boolean!
  }

  extend type Query {
      users: [User!]!
      user(id: ID!) : User
  }

  extend type Mutation {
      createUser(name: String!, email: String!, password: String!, active: Boolean = true): User
      updateUser(id: ID!, name: String, email: String, password: String, active: Boolean = true): User
  }
`;
