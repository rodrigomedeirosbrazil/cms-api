const { Order } = require('../config/database');

const getOrders = function() {
  return Order.findAll();
};

const getOrder = function(id) {
  return Order.findOne({ where: { id: id } });
};

const createOrder = function(params) {
  return Order.create(params);
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
  return res;
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder
};
