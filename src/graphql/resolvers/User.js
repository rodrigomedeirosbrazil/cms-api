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
    createUser: (_, { name, email, password, active }) => {
      return CreateUser(name, email, password, active);
    },
    updateUser: async (_, { id, name, email, password, active }) => {
      return UpdateUser(id, name, email, password, active);
    }
  }
};
