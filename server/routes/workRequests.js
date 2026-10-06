const express = require('express');
const router = express.Router();
const WorkRequest = require('../models/WorkRequest');
const Connection = require('../models/Connection');
const Labour = require('../models/Labour');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const POPULATE = [
  { path: 'farmer', select: 'name village phone' },
  { path: 'worker', select: 'name village phone isAvailable' }
];

// POST /api/work-requests  { targetUserId, message, proposedDate, vacancyId? }
// A worker can request work from a connected farmer, or a farmer can request a connected worker.
router.post('/', requireAuth, async (req, res) => {
  try {
    const { targetUserId, message, proposedDate, vacancyId } = req.body;
    const target = await User.findById(targetUserId);
    if (!target) return res.status(404).json({ error: 'User not found' });
    if (target.role === req.user.role) {
      return res.status(400).json({ error: 'Requests can only go to the opposite account type' });
    }

    const farmerId = req.user.role === 'farmer' ? req.user.id : target._id;
    const workerId = req.user.role === 'worker' ? req.user.id : target._id;

    const connection = await Connection.findOne({ farmer: farmerId, worker: workerId, status: 'accepted' });
    if (!connection) {
      return res.status(400).json({ error: 'You must be connected with this person first' });
    }

    const workRequest = new WorkRequest({
      farmer: farmerId,
      worker: workerId,
      initiatedBy: req.user.role,
      message: message || '',
      proposedDate: proposedDate || '',
      vacancy: vacancyId || null
    });
    await workRequest.save();
    await workRequest.populate(POPULATE);
    res.status(201).json(workRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/work-requests — everything sent or received by the current user
router.get('/', requireAuth, async (req, res) => {
  try {
    const filter = req.user.role === 'farmer' ? { farmer: req.user.id } : { worker: req.user.id };
    const requests = await WorkRequest.find(filter).populate(POPULATE).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/work-requests/:id/accept
// Only the recipient (the one who did NOT send it) can accept. Accepting a
// request between a farmer and worker makes sure a Labour record links them,
// so the farmer can start logging work days and payments right away.
router.put('/:id/accept', requireAuth, async (req, res) => {
  try {
    const wr = await WorkRequest.findById(req.params.id);
    if (!wr) return res.status(404).json({ error: 'Request not found' });

    const isParty = (req.user.role === 'farmer' && String(wr.farmer) === req.user.id) ||
                     (req.user.role === 'worker' && String(wr.worker) === req.user.id);
    if (!isParty) return res.status(403).json({ error: 'Not your request' });
    if (wr.initiatedBy === req.user.role) {
      return res.status(400).json({ error: 'Waiting for the other side to accept' });
    }

    wr.status = 'accepted';
    await wr.save();

    // Ensure a Labour record exists linking this worker to this farmer
    let labour = await Labour.findOne({ farmer: wr.farmer, worker: wr.worker });
    if (!labour) {
      const workerUser = await User.findById(wr.worker);
      labour = new Labour({ farmer: wr.farmer, worker: wr.worker, name: workerUser.name, workdays: [], payments: [] });
      await labour.save();
    }

    await wr.populate(POPULATE);
    res.json({ workRequest: wr, labourId: labour._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/work-requests/:id/decline
router.put('/:id/decline', requireAuth, async (req, res) => {
  try {
    const wr = await WorkRequest.findById(req.params.id);
    if (!wr) return res.status(404).json({ error: 'Request not found' });
    wr.status = 'declined';
    await wr.save();
    res.json(wr);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
