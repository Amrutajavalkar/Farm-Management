const express = require('express');
const router = express.Router();
const Labour = require('../models/Labour');

// GET all labourers
router.get('/', async (req, res) => {
  try {
    const labours = await Labour.find().sort({ createdAt: -1 });
    res.json(labours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new labourer
router.post('/', async (req, res) => {
  try {
    const labour = new Labour({ name: req.body.name });
    await labour.save();
    res.status(201).json(labour);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a labourer and all their records
router.delete('/:id', async (req, res) => {
  try {
    await Labour.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add a work day (date + wage) to a labourer
router.post('/:id/workdays', async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);
    if (!labour) return res.status(404).json({ error: 'Labour not found' });
    labour.workdays.push({ date: req.body.date, wage: req.body.wage });
    await labour.save();
    res.status(201).json(labour);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a work day
router.delete('/:id/workdays/:workdayId', async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);
    if (!labour) return res.status(404).json({ error: 'Labour not found' });
    labour.workdays = labour.workdays.filter(
      (w) => w._id.toString() !== req.params.workdayId
    );
    await labour.save();
    res.json(labour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
    await labour.save();
    res.status(201).json(labour);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a payment
router.delete('/:id/payments/:paymentId', async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);
    if (!labour) return res.status(404).json({ error: 'Labour not found' });
    labour.payments = labour.payments.filter(
      (p) => p._id.toString() !== req.params.paymentId
    );
    await labour.save();
    res.json(labour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
