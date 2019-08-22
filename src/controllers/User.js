const { User } = require('../config/database');

const getUsers = function() {
  return User.findAll();
};

const getUser = function(id) {
  return User.findOne({ where: { id: id } });
};

const CreateUser = function(params) {
  return User.create(params);
};

const UpdateUser = async function(params) {
  let res = null;
  await User.update(params, {
    where: { id: params.id },
    limit: 1,
    returning: true
  }).then(function([rowsUpdated, [updatedUser]]) {
    res = updatedUser;
  });
  return res;
};

module.exports = {
  getUsers,
  getUser,
  CreateUser,
  UpdateUser
};
