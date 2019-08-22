const {
  getOrder,
  getOrders,
  createOrder,
  updateOrder
} = require('../../controllers/Order');

module.exports = {
  Query: {
    orders: () => getOrders(),
    order: (_, { id }) => getOrder(id)
  },
  Mutation: {
    createOrder: (_, params) => {
      return createOrder(params);
    },
    updateOrder: async (_, params) => {
      return updateOrder(params);
    }
  }
};
