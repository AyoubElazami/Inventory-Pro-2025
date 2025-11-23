const express = require('express');
const router = express.Router();
const { Order, OrderItem, Product } = require('../models');

// Create order (body: { customerName, customerEmail, items: [{productId, quantity}] })
router.post('/', async (req, res) => {
  const t = await require('../models').sequelize.transaction();
  try {
    const { customerName, customerEmail, items } = req.body;
    let total = 0;
    // create order
    const order = await Order.create({ customerName, customerEmail, status: 'confirmed' }, { transaction: t });
    for (const it of items) {
      const prod = await Product.findByPk(it.productId, { transaction: t });
      if (!prod) throw new Error('Product not found: ' + it.productId);
      if (prod.quantity < it.quantity) throw new Error(`Insufficient stock for ${prod.name}`);
      const price = prod.price;
      total += price * it.quantity;
      await OrderItem.create({
        orderId: order.id,
        productId: prod.id,
        quantity: it.quantity,
        price
      }, { transaction: t });
      // decrement stock
      prod.quantity = prod.quantity - it.quantity;
      await prod.save({ transaction: t });
    }
    order.total = total;
    await order.save({ transaction: t });
    await t.commit();
    res.status(201).json(order);
  } catch (err) {
    await t.rollback();
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const orders = await Order.findAll({ include: OrderItem });
  res.json(orders);
});

module.exports = router;
