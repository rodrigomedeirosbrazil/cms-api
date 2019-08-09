module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    name: {
      type: DataTypes.STRING
    },
    description: {
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
    },
    width: {
      type: DataTypes.INTEGER
    },
    height: {
      type: DataTypes.INTEGER
    },
    length: {
      type: DataTypes.INTEGER
    },
    active: {
      type: DataTypes.BOOLEAN,
      default: true
    }
  });

  return Item;
};
