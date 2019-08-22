const {
  getItem,
  getItems,
  createItem,
  updateItem
} = require('../../controllers/Item');

module.exports = {
  Query: {
    items: () => getItems(),
    item: (_, { id }) => getItem(id)
  },
  Mutation: {
    createItem: (_, params) => {
      return createItem(params);
    },
    updateItem: async (_, params) => {
      return updateItem(params);
    }
  }
};
