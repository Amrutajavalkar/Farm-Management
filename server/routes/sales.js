const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Crop = require('../models/Crop');
<<<<<<< HEAD
const { requireAuth, requireRole } = require('../middleware/auth');

// GET /api/sales — all sale receipts for crops owned by this farmer (optionally ?cropId=...)
router.get('/', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const myCropIds = await Crop.find({ farmer: req.user.id }).distinct('_id');
    const filter = { crop: { $in: myCropIds } };
=======

// GET all sale receipts (optionally filtered by ?cropId=...)
router.get('/', async (req, res) => {
  try {
    const filter = {};
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
    if (req.query.cropId) filter.crop = req.query.cropId;
    const sales = await Sale.find(filter).populate('crop', 'name').sort({ date: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< HEAD
// POST /api/sales
router.post('/', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const { cropId, buyerName, date, weight, unit, pricePerUnit } = req.body;
    const crop = await Crop.findOne({ _id: cropId, farmer: req.user.id });
    if (!crop) return res.status(404).json({ error: 'Crop not found' });

    const amount = Number(weight || 0) * Number(pricePerUnit || 0);
    const sale = new Sale({ crop: cropId, buyerName, date, weight, unit, pricePerUnit, amount });
=======
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
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
    await sale.save();
    await sale.populate('crop', 'name');
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

<<<<<<< HEAD
// DELETE /api/sales/:id
router.delete('/:id', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('crop', 'farmer');
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    if (String(sale.crop.farmer) !== req.user.id) return res.status(403).json({ error: 'Not your sale record' });
=======
// DELETE a sale receipt
router.delete('/:id', async (req, res) => {
  try {
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
    await Sale.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
