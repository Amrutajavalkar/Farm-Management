const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const Sale = require('../models/Sale');
const { requireAuth, requireRole } = require('../middleware/auth');

const EDITABLE_FIELDS = [
  'name',
  'seedPrice',
  'labourAmount',
  'fertilizerAmount',
  'sprayAmount',
  'otherAmount'
];

// GET /api/crops — this farmer's own crops
router.get('/', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user.id }).sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/crops
router.post('/', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const crop = new Crop({ farmer: req.user.id, name: req.body.name });
    await crop.save();
    res.status(201).json(crop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/crops/:id
router.put('/:id', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const updates = {};
    EDITABLE_FIELDS.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user.id },
      updates,
      { new: true, runValidators: true }
    );
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    res.json(crop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/crops/:id (also removes its sale receipts)
router.delete('/:id', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({ _id: req.params.id, farmer: req.user.id });
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    await Sale.deleteMany({ crop: crop._id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
