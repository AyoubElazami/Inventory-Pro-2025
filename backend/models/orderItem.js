const { DataTypes } = require('sequelize');
const  sequelize  = require('../config/database'); // <- important !

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orderId: { type: DataTypes.INTEGER },
  productId: { type: DataTypes.INTEGER },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  price: { type: DataTypes.FLOAT, defaultValue: 0 }
}, {
  tableName: 'order_items'
});

module.exports = OrderItem;
