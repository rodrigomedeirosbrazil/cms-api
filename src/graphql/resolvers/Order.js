const { Order } = require('../../config/database');

module.exports = {
  Query: {
    orders: () => Order.findAll(),
    order: (_, { id }) => Order.findOne({ where: { id: id } })
  },
  Mutation: {
    createOrder: (
      _,
      { name, CustomerId, value, date_pickup, date_back, active }
    ) =>
      Order.create({
        name,
        CustomerId,
        value,
        date_pickup,
        date_back,
        active
      }),
    updateOrder: async (
      _,
      { id, name, value, date_pickup, date_back, active }
    ) => {
      const order = await Order.findOne({ where: { id: id } });
      if (!order) {
        throw Error(`Order not updated. id: ${id}`);
      }
      name && (order.name = name);
      value && (order.value = value);
      date_pickup && (order.date_pickup = date_pickup);
      date_back && (order.date_back = date_back);
      active && (order.active = active);
      order.save();

      return order;
    }
  }
};
