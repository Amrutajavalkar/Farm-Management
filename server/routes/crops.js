const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const Sale = require('../models/Sale');
<<<<<<< HEAD
const { requireAuth, requireRole } = require('../middleware/auth');
=======
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69

const EDITABLE_FIELDS = [
  'name',
  'seedPrice',
  'labourAmount',
  'fertilizerAmount',
  'sprayAmount',
  'otherAmount'
];

<<<<<<< HEAD
// GET /api/crops — this farmer's own crops
router.get('/', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user.id }).sort({ createdAt: -1 });
=======
// GET all crops
router.get('/', async (req, res) => {
  try {
    const crops = await Crop.find().sort({ createdAt: -1 });
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< HEAD
// POST /api/crops
router.post('/', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const crop = new Crop({ farmer: req.user.id, name: req.body.name });
=======
// POST create a new crop
router.post('/', async (req, res) => {
  try {
    const crop = new Crop({ name: req.body.name });
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
    await crop.save();
    res.status(201).json(crop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

<<<<<<< HEAD
// PUT /api/crops/:id
router.put('/:id', requireAuth, requireRole('farmer'), async (req, res) => {
=======
// PUT update crop fields (seed price, labour amount, fertilizer, spray, other, revenue)
router.put('/:id', async (req, res) => {
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
  try {
    const updates = {};
    EDITABLE_FIELDS.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
<<<<<<< HEAD
    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user.id },
      updates,
      { new: true, runValidators: true }
    );
=======
    const crop = await Crop.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    res.json(crop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

<<<<<<< HEAD
// DELETE /api/crops/:id (also removes its sale receipts)
router.delete('/:id', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({ _id: req.params.id, farmer: req.user.id });
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    await Sale.deleteMany({ crop: crop._id });
=======
// DELETE a crop (also removes its sale receipts)
router.delete('/:id', async (req, res) => {
  try {
    await Crop.findByIdAndDelete(req.params.id);
    await Sale.deleteMany({ crop: req.params.id });
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
