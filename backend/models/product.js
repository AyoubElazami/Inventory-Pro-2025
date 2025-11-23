const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // <- import direct

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
});

module.exports = Product;
