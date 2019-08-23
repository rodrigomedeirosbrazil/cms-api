const { Order, OrderItem } = require('../config/database');

const getOrders = function() {
  return Order.findAll();
};

const getOrder = function(id) {
  return Order.findOne({ where: { id: id } });
};

const createOrder = async function(params) {
  const order = await Order.create(params);
  params.items.map(item => {
    OrderItem.create({
      value: item.value,
      value_repo: item.value_repo,
      quantity: item.quantity,
      OrderId: order.id,
      ItemId: item.id
    });
    return true;
  });
  return order;
};

const updateOrder = async function(params) {
  let res = null;
  await Order.update(params, {
    where: { id: params.id },
    limit: 1,
    returning: true
  }).then(function([rowsUpdated, [updatedOrder]]) {
    res = updatedOrder;
  });

  if (params.items) {
    OrderItem.destroy({
      where: {
        OrderId: params.id
      }
    });
    params.items.map(item => {
      OrderItem.create({
        value: item.value,
        value_repo: item.value_repo,
        quantity: item.quantity,
        OrderId: params.id,
        ItemId: item.id
      });
      return true;
    });
  }

  return res;
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder
};
