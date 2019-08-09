const { User } = require('./config/database');

module.exports = {
  Query: {
    users: () => User.findAll(),
    user: (_, { id }) => User.findOne({ where: { id: id } })
  },
  Mutation: {
    createUser: (_, { name, email, password, active }) =>
      User.create({ name, email, password, active })
  }
};
