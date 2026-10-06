const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    // Who sent the connection request — the other side must accept it
    requestedBy: { type: String, enum: ['farmer', 'worker'], required: true }
  },
  { timestamps: true }
);

// A farmer and worker can only have one connection record between them
connectionSchema.index({ farmer: 1, worker: 1 }, { unique: true });

module.exports = mongoose.model('Connection', connectionSchema);
