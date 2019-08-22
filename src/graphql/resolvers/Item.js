const {
  getItem,
  getItems,
  createItem,
  updateItem
} = require('../../controllers/Item');

module.exports = {
  Query: {
    items: (_, __, req) => getItems(req),
    item: (_, { id }, req) => getItem(id, req)
  },
  Mutation: {
    createItem: (_, params, req) => {
      return createItem(params, req);
    },
    updateItem: async (_, params, req) => {
      return updateItem(params, req);
    }
  }
};
