module.exports = `
  type User {
      id: ID!
      name: String!
      email: String!
      password: String!
      active: Boolean!
  }

  type Query {
      users: [User!]!
      user(id: ID!) : User
  }

  type Mutation {
      createUser(name: String!, email: String!, password: String!, active: Boolean = true): User
      updateUser(id: ID!, name: String, email: String, password: String, active: Boolean = true): User
  }
`;