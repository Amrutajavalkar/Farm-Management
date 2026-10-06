const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Connection = require('../models/Connection');
const { requireAuth } = require('../middleware/auth');

// GET /api/users/search?q=name-or-email
// Returns users of the OPPOSITE role to the current user (a farmer searches workers, and vice versa),
// each annotated with the current connection status (if any) between them.
router.get('/search', requireAuth, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);

    const targetRole = req.user.role === 'farmer' ? 'worker' : 'farmer';
    const regex = new RegExp(q, 'i');

    const users = await User.find({
      role: targetRole,
      $or: [{ name: regex }, { email: regex }]
    }).limit(20);

    const farmerId = req.user.role === 'farmer' ? req.user.id : null;
    const results = await Promise.all(
      users.map(async (u) => {
        const filter = req.user.role === 'farmer'
          ? { farmer: req.user.id, worker: u._id }
          : { farmer: u._id, worker: req.user.id };
        const connection = await Connection.findOne(filter);
        const safe = u.toSafeObject();
        return { ...safe, connection: connection || null };
      })
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
