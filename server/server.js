require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const connectionRoutes = require('./routes/connections');
const availabilityRoutes = require('./routes/availability');
const vacancyRoutes = require('./routes/vacancies');
const workRequestRoutes = require('./routes/workRequests');
const labourRoutes = require('./routes/labours');
const cropRoutes = require('./routes/crops');
const saleRoutes = require('./routes/sales');

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/vacancies', vacancyRoutes);
app.use('/api/work-requests', workRequestRoutes);
app.use('/api/labours', labourRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/sales', saleRoutes);

// Serve the frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not set. Copy .env.example to .env and add your connection string.');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Add one to your .env file.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Farm Ledger server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
