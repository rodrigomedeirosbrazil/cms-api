const { Login } = require('../../controllers/Auth');

module.exports = {
  Query: {
    isLogin: (parent, args, { req }) => typeof req.session.user !== 'undefined'
  },
  Mutation: {
    login: async (parent, { email, password }, { req }) => {
      return await Login(email, password);
    }
  }
};
