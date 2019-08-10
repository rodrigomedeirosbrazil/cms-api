const { Customer } = require('../../config/database');

module.exports = {
  Query: {
    customers: () => Customer.findAll(),
    customer: (_, { id }) => Customer.findOne({ where: { id: id } })
  },
  Mutation: {
    createCustomer: (
      _,
      { name, UserId, email, address, city, state, zip, active }
    ) =>
      Customer.create({
        name,
        UserId,
        email,
        address,
        city,
        state,
        zip,
        active
      }),
    updateCustomer: async (
      _,
      { id, name, email, address, city, state, zip, active }
    ) => {
      const customer = await Customer.findOne({ where: { id: id } });
      if (!customer) {
        throw Error(`Customer not updated. id: ${id}`);
      }
      name && (customer.name = name);
      email && (customer.email = email);
      address && (customer.address = address);
      city && (customer.city = city);
      state && (customer.state = state);
      zip && (customer.zip = zip);
      active && (customer.active = active);
      customer.save();

      return customer;
    }
  }
};
