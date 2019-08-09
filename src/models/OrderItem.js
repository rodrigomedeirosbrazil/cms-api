module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    value: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        isDecimal: {
          msg: 'Esse campo precisa ter um valor tipo moeda.'
        }
      },
      default: 0
    },
    value_repo: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        isDecimal: {
          msg: 'Esse campo precisa ter um valor tipo moeda.'
        }
      },
      default: 0
    },
    quantity: {
      type: DataTypes.INTEGER,
      default: 0
    }
  });

  return OrderItem;
};
