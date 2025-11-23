require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { sequelize } = require('./models'); // <- vérifie que le chemin est correct

const productsRouter = require('./routes/products');
const suppliersRouter = require('./routes/suppliers');
const ordersRouter = require('./routes/orders');
const reportsRouter = require('./routes/reports');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/products', productsRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reports', reportsRouter);

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate(); // Vérifie la connexion
    await sequelize.sync({ alter: true }); 
    console.log('✅ DB connected & synced');
    app.listen(PORT, () => console.log(`Server started on ${PORT}`));
  } catch (err) {
    console.error('❌ DB connection error:', err);
  }
})();
