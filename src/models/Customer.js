module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('costumers', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      validade: {
        isEmail: {
          msg: 'Esse campo precisa ser um email válido.'
        }
      }
    },
    address: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING(2)
    },
    zip: {
      type: DataTypes.STRING(8)
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: true
    }
  });

  return Customer;
};
