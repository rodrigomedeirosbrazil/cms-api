const { Customer } = require('../config/database');

const getCustomers = function() {
  return Customer.findAll();
};

const getCustomer = function(id) {
  return Customer.findOne({ where: { id: id } });
};

const createCustomer = function(params) {
  return Customer.create(params);
};

const updateCustomer = async function(params) {
  let res = null;
  await Customer.update(params, {
    where: { id: params.id },
    limit: 1,
    returning: true
  }).then(function([rowsUpdated, [updatedCustomer]]) {
    res = updatedCustomer;
  });
  return res;
};

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer
};
