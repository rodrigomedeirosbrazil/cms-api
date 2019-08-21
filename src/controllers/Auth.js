const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../config/database');

const Login = async function(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw Error('User not found');

  if (await bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id }, 'secretKey', {
      expiresIn: '6h'
    });
    return token;
  }

  throw new Error('Incorrect password.');
};

module.exports = {
  Login
};
