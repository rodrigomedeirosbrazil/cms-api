module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    name: {
      type: DataTypes.STRING
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        isDecimal: {
          msg: 'Esse campo precisa ter um valor tipo moeda.'
        }
      },
      default: 0
    },
    date_pickup: {
      type: DataTypes.DATE
    },
    date_back: {
      type: DataTypes.DATE
    },
    active: {
      type: DataTypes.BOOLEAN,
      default: true
    }
  });

  return Order;
};
