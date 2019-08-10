const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validade: {
          isEmpty: {
            msg: 'Esse campo precisa preenchido.'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validade: {
          isEmail: {
            msg: 'Esse campo precisa ser um email válido.'
          }
        }
      },
      password: {
        type: DataTypes.STRING
      },
      active: {
        type: DataTypes.BOOLEAN,
        default: true
      }
    },
    {
      hooks: {
        beforeCreate: (users, options) => {
          {
            users.password =
              users.password && users.password != ''
                ? bcrypt.hashSync(users.password, 10)
                : '';
          }
        },
        beforeUpdate: (users, options) => {
          {
            users.password =
              users.password && users.password != ''
                ? bcrypt.hashSync(users.password, 10)
                : '';
          }
        }
      }
    }
  );

  return User;
};
