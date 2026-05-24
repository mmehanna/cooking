require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripeRoutes = require('./routes/stripe.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8100', 'http://localhost:4200', 'capacitor://localhost'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/stripe', stripeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
