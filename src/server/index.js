const express = require('express');
const cors = require("cors");
const path = require('path');
const app = express();

const PORT = 3001;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3001', 'app://./'],
    credentials: true
}));
app.use(express.json());

// Serve static files from the built React app
app.use(express.static(path.join(__dirname, '../../dist/renderer')));

// API routes
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

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/renderer/index.html'));
});

// Export the app for Electron to use
module.exports = app;

// Only start the server if this file is run directly (not when required by Electron)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}