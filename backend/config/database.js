// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,       // nom de la base
  process.env.DB_USER,       // utilisateur MySQL
  process.env.DB_PASSWORD,   // mot de passe
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;   // <- export direct, PAS d'accolades
