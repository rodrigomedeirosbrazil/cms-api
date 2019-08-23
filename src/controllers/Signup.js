const { User } = require('../config/database');

const signup = async function(params) {
  const user = await User.findOne({ where: { email: params.email } });
  if (user) throw Error('Email already exists.');
  const createdUser = User.create(params);
  return createdUser ? true : false;
};

module.exports = {
  signup
};
