const mongoose = require('mongoose');

const workRequestSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Who sent this particular request
    initiatedBy: { type: String, enum: ['farmer', 'worker'], required: true },
    message: { type: String, default: '' },
    proposedDate: { type: String, default: '' },
    vacancy: { type: mongoose.Schema.Types.ObjectId, ref: 'Vacancy', default: null },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkRequest', workRequestSchema);
