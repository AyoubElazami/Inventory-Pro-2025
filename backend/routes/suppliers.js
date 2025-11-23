const express = require('express');
const router = express.Router();
const { Supplier } = require('../models');

// Create supplier
router.post('/', async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Read all suppliers
router.get('/', async (req, res) => {
  const suppliers = await Supplier.findAll();
  res.json(suppliers);
});

// Read one supplier
router.get('/:id', async (req, res) => {
  const s = await Supplier.findByPk(req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  res.json(s);
});

// Update
router.put('/:id', async (req, res) => {
  const s = await Supplier.findByPk(req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  await s.update(req.body);
  res.json(s);
});

// Delete
router.delete('/:id', async (req, res) => {
  const s = await Supplier.findByPk(req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  await s.destroy();
  res.json({ ok: true });
});

module.exports = router;
