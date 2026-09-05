const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Crop = require('../models/Crop');

// GET all sale receipts (optionally filtered by ?cropId=...)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.cropId) filter.crop = req.query.cropId;
    const sales = await Sale.find(filter).populate('crop', 'name').sort({ date: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new sale receipt for a crop
router.post('/', async (req, res) => {
  try {
    const { cropId, buyerName, date, weight, unit, pricePerUnit } = req.body;
    const crop = await Crop.findById(cropId);
    if (!crop) return res.status(404).json({ error: 'Crop not found' });

    const amount = Number(weight || 0) * Number(pricePerUnit || 0);

    const sale = new Sale({
      crop: cropId,
      buyerName,
      date,
      weight,
      unit,
      pricePerUnit,
      amount
    });
    await sale.save();
    await sale.populate('crop', 'name');
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a sale receipt
router.delete('/:id', async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
