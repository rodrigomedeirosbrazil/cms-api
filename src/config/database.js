const Sequelize = require('sequelize');
const UserModel = require('../models/User');
const CustomerModel = require('../models/Customer');
const OrderModel = require('../models/Order');
const ItemModel = require('../models/Item');
const OrderItemModel = require('../models/OrderItem');

const sequelize = new Sequelize('cms', 'default', 'secret', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const User = UserModel(sequelize, Sequelize);
const Customer = CustomerModel(sequelize, Sequelize);
const Order = OrderModel(sequelize, Sequelize);
const Item = ItemModel(sequelize, Sequelize);
const OrderItem = OrderItemModel(sequelize, Sequelize);

User.hasMany(Customer);
Customer.belongsTo(User);
Customer.hasMany(Order);
Order.belongsTo(Customer);
Order.belongsToMany(Item, { through: OrderItem });
Item.belongsToMany(Order, { through: OrderItem });
Item.belongsTo(User);

// sequelize.sync({ force: true }).then(() => {
//   console.log('Database & tables created!');
// });

module.exports = {
  User,
  Customer,
  Order,
  Item,
  OrderItem
};
