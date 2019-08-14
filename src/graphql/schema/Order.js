module.exports = `
  type Order {
    id: ID!
    name: String,
    CustomerId: ID!
    value: Float!
    date_pickup: String
    date_back: String
    active: Boolean
}

  extend type Query {
      orders: [Order!]!
      order(id: ID!) : Order
  }

  extend type Mutation {
      createOrder(name: String, CustomerId: ID!, value: Float!, date_pickup: String, date_back: String, active: Boolean = true): Order
      updateOrder(id: ID!, name: String, value: Float!, date_pickup: String, date_back: String, active: Boolean = true): Order
  }
`;
