const { Item } = require('../config/database');

const getItems = function() {
  return Item.findAll();
};

const getItem = function(id) {
  return Item.findOne({ where: { id: id } });
};

const createItem = function(params) {
  return Item.create(params);
};

const updateItem = async function(params) {
  let res = null;
  await Item.update(params, {
    where: { id: params.id },
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
