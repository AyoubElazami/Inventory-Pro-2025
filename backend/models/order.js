const { DataTypes } = require('sequelize');
const  sequelize  = require('../config/database'); // <- important !

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  customerName: { type: DataTypes.STRING },
  customerEmail: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  total: { type: DataTypes.FLOAT, defaultValue: 0 }
}, {
  tableName: 'orders'
});

module.exports = Order;
