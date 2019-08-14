module.exports = `
  type Item {
    id: ID!
    UserId: ID!
    name: String!,
    description: String,
    value: Float!
    value_repo: Float
    quantity: Int
    width: Int
    height: Int
    length: Int
    active: Boolean
}

  extend type Query {
      items: [Item!]!
      item(id: ID!) : Item
  }

  extend type Mutation {
      createItem(
        UserId: ID!
        name: String!,
        description: String,
        value: Float!,
        value_repo: Float,
        quantity: Int = 0,
        width: Int,
        height: Int,
        length: Int,
        active: Boolean = true
      ): Item
      updateItem(
        id: ID!,
        name: String!,
        description: String,
        value: Float!,
        value_repo: Float,
        quantity: Int = 0,
        width: Int,
        height: Int,
        length: Int,
        active: Boolean = true
      ): Item
  }
`;
