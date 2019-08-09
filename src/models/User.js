const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
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
        allowNull: false,
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
        }
      }
    }
  );

  return User;
};
