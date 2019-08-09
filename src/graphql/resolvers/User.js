const { User } = require('../../config/database');

module.exports = {
  Query: {
    users: () => User.findAll(),
    user: (_, { id }) => User.findOne({ where: { id: id } })
  },
  Mutation: {
    createUser: (_, { name, email, password, active }) =>
      User.create({ name, email, password, active }),
    updateUser: async (_, { id, name, email, password, active }) => {
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
    }
  }
};
