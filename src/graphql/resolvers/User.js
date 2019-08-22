const {
  getUser,
  getUsers,
  CreateUser,
  UpdateUser
} = require('../../controllers/User');

module.exports = {
  Query: {
    users: () => getUsers(),
    user: (_, { id }) => getUser(id)
  },
  Mutation: {
    createUser: (_, params) => {
      return CreateUser(params);
    },
    updateUser: async (_, params) => {
      return UpdateUser(params);
    }
  }
};
