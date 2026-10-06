const express = require('express');
const router = express.Router();
const Vacancy = require('../models/Vacancy');
const Connection = require('../models/Connection');
const { requireAuth, requireRole } = require('../middleware/auth');

// POST /api/vacancies  (farmer only)
router.post('/', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const { title, description, date, wageOffered } = req.body;
    const vacancy = new Vacancy({ farmer: req.user.id, title, description, date, wageOffered });
    await vacancy.save();
    res.status(201).json(vacancy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/vacancies/mine  (farmer only) — this farmer's own postings
router.get('/mine', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const vacancies = await Vacancy.find({ farmer: req.user.id }).sort({ createdAt: -1 });
    res.json(vacancies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/vacancies/visible  (worker only)
// Open vacancies from farmers this worker is connected with — never shown farm-wide/publicly.
router.get('/visible', requireAuth, requireRole('worker'), async (req, res) => {
  try {
    const connections = await Connection.find({ worker: req.user.id, status: 'accepted' });
    const farmerIds = connections.map(c => c.farmer);
    const vacancies = await Vacancy.find({ farmer: { $in: farmerIds }, status: 'open' })
      .populate('farmer', 'name village phone')
      .sort({ createdAt: -1 });
    res.json(vacancies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/vacancies/:id/close  (farmer only, own vacancy)
router.put('/:id/close', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const vacancy = await Vacancy.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user.id },
      { status: 'closed' },
      { new: true }
    );
    if (!vacancy) return res.status(404).json({ error: 'Vacancy not found' });
    res.json(vacancy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/vacancies/:id  (farmer only, own vacancy)
router.delete('/:id', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    await Vacancy.findOneAndDelete({ _id: req.params.id, farmer: req.user.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
