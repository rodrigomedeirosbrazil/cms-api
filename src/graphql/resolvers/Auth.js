const { User } = require('../../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  Query: {
    isLogin: (parent, args, { req }) => typeof req.session.user !== 'undefined'
  },
  Mutation: {
    login: async (parent, { email, password }, { req }) => {
      const user = await User.findOne({ where: { email: email } });
      if (!user) throw Error('User not found');

      if (await bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id }, 'secretKey', {
          expiresIn: '1h'
        });
        return token;
      }

      throw new Error('Incorrect password.');
    }
  }
};
