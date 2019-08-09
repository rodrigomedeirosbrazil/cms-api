module.exports = `
  type Customer {
    id: ID!
    name: String!
    email: String
    address: String
    city: String
    state: String
    zip: String
    active: Boolean
}

  extend type Query {
      customers: [Customer!]!
      customer(id: ID!) : Customer
  }

  extend type Mutation {
      createCustomer(name: String!, email: String, address: String, city: String, state: String, zip: String, active: Boolean = true): Customer
      updateCustomer(id: ID!, name: String, email: String, address: String, city: String, state: String, zip: String, active: Boolean = true): Customer
  }
`;
