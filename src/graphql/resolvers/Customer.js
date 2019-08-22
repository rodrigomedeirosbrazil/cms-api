const {
  getCustomer,
  getCustomers,
  createCustomer,
  updateCustomer
} = require('../../controllers/Customer');

module.exports = {
  Query: {
    customers: () => getCustomers(),
    customer: (_, { id }) => getCustomer(id)
  },
  Mutation: {
    createCustomer: (_, params) => {
      return createCustomer(params);
    },
    updateCustomer: async (_, params) => {
      return updateCustomer(params);
    }
  }
};
