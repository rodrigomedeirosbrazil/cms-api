const { Customer } = require('../config/database');
const { checkUser } = require('../graphql/shield');

const getCustomers = function(req) {
  const UserId = checkUser(req);
  return Customer.findAll({ where: { UserId } });
};

const getCustomer = function(id, req) {
  const UserId = checkUser(req);
  return Customer.findOne({ where: { id, UserId } });
};

const createCustomer = function(params, req) {
  const UserId = checkUser(req);
  const _params = { ...params, UserId };
  return Customer.create(_params);
};

const updateCustomer = async function(params, req) {
  let res = null;
  const UserId = checkUser(req);
  await Customer.update(params, {
    where: { id: params.id, UserId },
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
