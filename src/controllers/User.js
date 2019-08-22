const { User } = require('../config/database');

const getUsers = async function() {
  return User.findAll();
};

const getUser = async function(id) {
  return User.findOne({ where: { id: id } });
};

const CreateUser = async function(name, email, password, active) {
  const user = await User.create({ name, email, password, active });
  if (!user) throw Error('User not found');
  return user;
};

const UpdateUser = async function(id, name, email, password, active) {
  const user = await User.findOne({ where: { id: id } });
  if (!user) {
    throw Error(`User not updated. id: ${id}`);
  }
  name && (user.name = name);
  email && (user.email = email);
  password && (user.password = password);
  active && (user.active = active);
  user.save();

  return user;
};

module.exports = {
  getUsers,
  getUser,
  CreateUser,
  UpdateUser
};
