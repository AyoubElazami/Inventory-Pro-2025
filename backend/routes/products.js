const express = require('express');
const router = express.Router();
const { Product, Supplier } = require('../models');

// Create product
router.post('/', async (req, res) => {
  try {
    const p = await Product.create(req.body);
    res.status(201).json(p);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Read all
router.get('/', async (req, res) => {
  const products = await Product.findAll({ include: Supplier });
  res.json(products);
});

// Read one
router.get('/:id', async (req, res) => {
  const p = await Product.findByPk(req.params.id, { include: Supplier });
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

// Update
router.put('/:id', async (req, res) => {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  await p.update(req.body);
  res.json(p);
});

// Delete
router.delete('/:id', async (req, res) => {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  await p.destroy();
  res.json({ ok: true });
});

module.exports = router;
