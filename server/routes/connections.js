const express = require('express');
const router = express.Router();
const Connection = require('../models/Connection');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

// POST /api/connections  { targetUserId }
// Either a farmer or a worker can start this — the target must be the opposite role.
router.post('/', requireAuth, async (req, res) => {
  try {
    const target = await User.findById(req.body.targetUserId);
    if (!target) return res.status(404).json({ error: 'User not found' });
    if (target.role === req.user.role) {
      return res.status(400).json({ error: 'You can only connect with the opposite account type' });
    }

    const farmerId = req.user.role === 'farmer' ? req.user.id : target._id;
    const workerId = req.user.role === 'worker' ? req.user.id : target._id;

    let connection = await Connection.findOne({ farmer: farmerId, worker: workerId });
    if (connection) {
      return res.status(400).json({ error: `A connection already exists (${connection.status})` });
    }

    connection = new Connection({
      farmer: farmerId,
      worker: workerId,
      status: 'pending',
      requestedBy: req.user.role
    });
    await connection.save();
    await connection.populate([{ path: 'farmer', select: 'name village phone' }, { path: 'worker', select: 'name village phone isAvailable' }]);
    res.status(201).json(connection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/connections?status=accepted
// Lists this user's connections (as farmer or as worker, whichever role they have).
router.get('/', requireAuth, async (req, res) => {
  try {
    const filter = req.user.role === 'farmer' ? { farmer: req.user.id } : { worker: req.user.id };
    if (req.query.status) filter.status = req.query.status;

    const connections = await Connection.find(filter)
      .populate('farmer', 'name village phone')
      .populate('worker', 'name village phone isAvailable availabilityNote availabilityUpdatedAt')
      .sort({ updatedAt: -1 });

    res.json(connections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/connections/:id/accept — only the side that DIDN'T request it can accept
router.put('/:id/accept', requireAuth, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);
    if (!connection) return res.status(404).json({ error: 'Connection not found' });

    const isParty = (req.user.role === 'farmer' && String(connection.farmer) === req.user.id) ||
                     (req.user.role === 'worker' && String(connection.worker) === req.user.id);
    if (!isParty) return res.status(403).json({ error: 'Not your connection request' });
    if (connection.requestedBy === req.user.role) {
      return res.status(400).json({ error: 'Waiting for the other side to accept' });
    }

    connection.status = 'accepted';
    await connection.save();
    await connection.populate([{ path: 'farmer', select: 'name village phone' }, { path: 'worker', select: 'name village phone isAvailable' }]);
    res.json(connection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/connections/:id/reject
router.put('/:id/reject', requireAuth, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);
    if (!connection) return res.status(404).json({ error: 'Connection not found' });
    connection.status = 'rejected';
    await connection.save();
    res.json(connection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/connections/:id — either party can remove an existing connection
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Connection.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
