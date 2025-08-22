const express = require('express');
const app = express();
const cors = require("cors");

const PORT = 3001;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());


const userRoutes = require('./api/routes/users');
const productsRoutes = require('./api/routes/products');
const customrsRoutes = require('./api/routes/customers');
const dueDetailsRoutes = require('./api/routes/dueDetails');
const saleRoute = require('./api/routes/sale');
const configRoutes = require('./api/routes/config');


app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/customers', customrsRoutes);
app.use('/api/v1/dueDetails', dueDetailsRoutes);
app.use('/api/v1/sale', saleRoute);
app.use('/api/v1/config', configRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
