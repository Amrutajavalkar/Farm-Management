const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Connection = require('../models/Connection');
const { requireAuth, requireRole } = require('../middleware/auth');

// PUT /api/availability/me  { isAvailable, note }  (worker only)
// This status is only ever shown to farmers this worker is connected with.
router.put('/me', requireAuth, requireRole('worker'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.isAvailable = !!req.body.isAvailable;
    user.availabilityNote = req.body.note || '';
    user.availabilityUpdatedAt = new Date();
    await user.save();
    res.json(user.toSafeObject());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/availability/connected-workers  (farmer only)
// Lists this farmer's accepted worker connections, each with their current availability.
router.get('/connected-workers', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const connections = await Connection.find({ farmer: req.user.id, status: 'accepted' })
      .populate('worker', 'name village phone isAvailable availabilityNote availabilityUpdatedAt');
    res.json(connections.map(c => c.worker));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
