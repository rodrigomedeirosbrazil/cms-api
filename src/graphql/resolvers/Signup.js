const { signup } = require('../../controllers/Signup');

module.exports = {
  Mutation: {
    signup: (_, params, req) => {
      return signup(params, req);
    }
  }
};
