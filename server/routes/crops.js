const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const Sale = require('../models/Sale');

const EDITABLE_FIELDS = [
  'name',
  'seedPrice',
  'labourAmount',
  'fertilizerAmount',
  'sprayAmount',
  'otherAmount'
];

// GET all crops
router.get('/', async (req, res) => {
  try {
    const crops = await Crop.find().sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new crop
router.post('/', async (req, res) => {
  try {
    const crop = new Crop({ name: req.body.name });
    await crop.save();
    res.status(201).json(crop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update crop fields (seed price, labour amount, fertilizer, spray, other, revenue)
router.put('/:id', async (req, res) => {
  try {
    const updates = {};
    EDITABLE_FIELDS.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    const crop = await Crop.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    res.json(crop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a crop (also removes its sale receipts)
router.delete('/:id', async (req, res) => {
  try {
    await Crop.findByIdAndDelete(req.params.id);
    await Sale.deleteMany({ crop: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
