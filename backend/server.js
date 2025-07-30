const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const db = require('./db');
const productRoutes = require('./routes/productRoutes'); // ✅ Use router file

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend running on Vercel!' });
});

// ✅ Use product routes
app.use('/api/', productRoutes);

// Catch-all route
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ✅ Export app for Vercel (no app.listen)
module.exports = app;
