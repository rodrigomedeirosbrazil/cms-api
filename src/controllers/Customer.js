const { Customer } = require('../config/database');
const { checkUser } = require('../graphql/shield');
const getCustomers = function(req) {
  const loggedUser = checkUser(req);
  return Customer.findAll({ where: { UserId: loggedUser } });
};

const getCustomer = function(req, id) {
  const loggedUser = checkUser(req);
  return Customer.findOne({ where: { UserId: loggedUser } });
};

const createCustomer = function(params, req) {
  const loggedUser = checkUser(req);
  const _params = { ...params, UserId: loggedUser };
  return Customer.create(_params);
};

const updateCustomer = async function(params, req) {
  let res = null;
  const loggedUser = checkUser(req);
  await Customer.update(params, {
    where: { id: params.id, UserId: loggedUser },
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
