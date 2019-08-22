const {
  getCustomer,
  getCustomers,
  createCustomer,
  updateCustomer
} = require('../../controllers/Customer');

module.exports = {
  Query: {
    customers: (_, __, req) => getCustomers(req),
    customer: (_, { id }, req) => getCustomer(req, id)
  },
  Mutation: {
    createCustomer: (_, params, req) => {
      return createCustomer(params, req);
    },
    updateCustomer: async (_, params, req) => {
      return updateCustomer(params, req);
    }
  }
};
