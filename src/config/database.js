require('dotenv/config');
const Sequelize = require('sequelize');
const UserModel = require('../models/User');
const CustomerModel = require('../models/Customer');
const OrderModel = require('../models/Order');
const ItemModel = require('../models/Item');
const OrderItemModel = require('../models/OrderItem');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
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

User.Customers = User.hasMany(Customer);
Customer.User = Customer.belongsTo(User);
Customer.Orders = Customer.hasMany(Order);
Order.Customer = Order.belongsTo(Customer);
Item.User = Item.belongsTo(User);
// Order.belongsToMany(Item, { through: OrderItem });
// Item.belongsToMany(Order, { through: OrderItem });

sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
});

module.exports = {
  User,
  Customer,
  Order,
  Item,
  OrderItem
};
