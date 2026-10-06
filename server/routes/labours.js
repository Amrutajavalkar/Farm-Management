const express = require('express');
const router = express.Router();
const Labour = require('../models/Labour');
<<<<<<< HEAD
const { requireAuth, requireRole } = require('../middleware/auth');

// GET /api/labours — this farmer's own labourers
router.get('/', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const labours = await Labour.find({ farmer: req.user.id }).sort({ createdAt: -1 });
=======

// GET all labourers
router.get('/', async (req, res) => {
  try {
    const labours = await Labour.find().sort({ createdAt: -1 });
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
    res.json(labours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< HEAD
// GET /api/labours/mine-as-worker — a worker's own wage/payment history across every farmer
router.get('/mine-as-worker', requireAuth, requireRole('worker'), async (req, res) => {
  try {
    const labours = await Labour.find({ worker: req.user.id })
      .populate('farmer', 'name village phone')
      .sort({ updatedAt: -1 });
    res.json(labours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/labours  { name, workerId? }
router.post('/', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const labour = new Labour({ farmer: req.user.id, name: req.body.name, worker: req.body.workerId || null });
=======
// POST create a new labourer
router.post('/', async (req, res) => {
  try {
    const labour = new Labour({ name: req.body.name });
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
    await labour.save();
    res.status(201).json(labour);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

<<<<<<< HEAD
// DELETE /api/labours/:id
router.delete('/:id', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    await Labour.findOneAndDelete({ _id: req.params.id, farmer: req.user.id });
=======
// DELETE a labourer and all their records
router.delete('/:id', async (req, res) => {
  try {
    await Labour.findByIdAndDelete(req.params.id);
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< HEAD
// POST /api/labours/:id/workdays  { date, wage }
router.post('/:id/workdays', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const labour = await Labour.findOne({ _id: req.params.id, farmer: req.user.id });
=======
// POST add a work day (date + wage) to a labourer
router.post('/:id/workdays', async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
    if (!labour) return res.status(404).json({ error: 'Labour not found' });
    labour.workdays.push({ date: req.body.date, wage: req.body.wage });
    await labour.save();
    res.status(201).json(labour);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

<<<<<<< HEAD
// DELETE /api/labours/:id/workdays/:workdayId
router.delete('/:id/workdays/:workdayId', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const labour = await Labour.findOne({ _id: req.params.id, farmer: req.user.id });
    if (!labour) return res.status(404).json({ error: 'Labour not found' });
    labour.workdays = labour.workdays.filter(w => w._id.toString() !== req.params.workdayId);
=======
// DELETE a work day
router.delete('/:id/workdays/:workdayId', async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);
    if (!labour) return res.status(404).json({ error: 'Labour not found' });
    labour.workdays = labour.workdays.filter(
      (w) => w._id.toString() !== req.params.workdayId
    );
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
    await labour.save();
    res.json(labour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< HEAD
// POST /api/labours/:id/payments  { date, amount, reason }
router.post('/:id/payments', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const labour = await Labour.findOne({ _id: req.params.id, farmer: req.user.id });
    if (!labour) return res.status(404).json({ error: 'Labour not found' });
    labour.payments.push({ date: req.body.date, amount: req.body.amount, reason: req.body.reason });
=======
// POST add a payment (date + amount + reason) to a labourer
router.post('/:id/payments', async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);
    if (!labour) return res.status(404).json({ error: 'Labour not found' });
    labour.payments.push({
      date: req.body.date,
      amount: req.body.amount,
      reason: req.body.reason
    });
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
    await labour.save();
    res.status(201).json(labour);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

<<<<<<< HEAD
// DELETE /api/labours/:id/payments/:paymentId
router.delete('/:id/payments/:paymentId', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const labour = await Labour.findOne({ _id: req.params.id, farmer: req.user.id });
    if (!labour) return res.status(404).json({ error: 'Labour not found' });
    labour.payments = labour.payments.filter(p => p._id.toString() !== req.params.paymentId);
=======
// DELETE a payment
router.delete('/:id/payments/:paymentId', async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);
    if (!labour) return res.status(404).json({ error: 'Labour not found' });
    labour.payments = labour.payments.filter(
      (p) => p._id.toString() !== req.params.paymentId
    );
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
    await labour.save();
    res.json(labour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
