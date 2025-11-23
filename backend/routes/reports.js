const express = require('express');
const router = express.Router();
const { Product } = require('../models');

// Low stock report
router.get('/low-stock', async (req, res) => {
  const threshold = parseInt(req.query.threshold || '5');
  const products = await Product.findAll({ where: { quantity: { [require('sequelize').Op.lte]: threshold } } });
  res.json(products);
});

// Stock value
router.get('/stock-value', async (req, res) => {
  const products = await Product.findAll();
  let totalValue = 0;
  products.forEach(p => totalValue += p.price * p.quantity);
  res.json({ totalValue, count: products.length });
});

module.exports = router;
