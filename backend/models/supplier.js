const { DataTypes } = require('sequelize');
const  sequelize  = require('../config/database'); // <- important !

const Supplier = sequelize.define('Supplier', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  contact: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING }
}, {
  tableName: 'suppliers'
});

module.exports = Supplier;
