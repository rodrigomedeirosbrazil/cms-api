const { Item } = require('../config/database');
const { checkUser } = require('../graphql/shield');

const getItems = function(req) {
  const UserId = checkUser(req);
  return Item.findAll({ where: { UserId } });
};

const getItem = function(id, req) {
  const UserId = checkUser(req);
  return Item.findOne({ where: { id, UserId } });
};

const createItem = function(params, req) {
  const UserId = checkUser(req);
  const _params = { ...params, UserId };
  return Item.create(_params);
};

const updateItem = async function(params, req) {
  let res = null;
  const UserId = checkUser(req);
  await Item.update(params, {
    where: { id: params.id, UserId },
    limit: 1,
    returning: true
  }).then(function([rowsUpdated, [updatedItem]]) {
    res = updatedItem;
  });
  return res;
};

module.exports = {
  getItems,
  getItem,
  createItem,
  updateItem
};
