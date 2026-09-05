require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const labourRoutes = require('./routes/labours');
const cropRoutes = require('./routes/crops');
const saleRoutes = require('./routes/sales');

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/labours', labourRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/sales', saleRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// Optional fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI is not set.');
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Farm Ledger server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);

        
    });