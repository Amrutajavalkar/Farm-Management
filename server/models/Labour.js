const mongoose = require('mongoose');

// A single day's work: the date worked and that day's wage
const workdaySchema = new mongoose.Schema(
  {
    date: { type: String, required: true },   // stored as 'YYYY-MM-DD'
    wage: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

// A single payment made to the labourer
const paymentSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    reason: { type: String, default: '' }
  },
  { timestamps: true }
);

const labourSchema = new mongoose.Schema(
  {
    // The farmer account this labour record belongs to
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Optional link to a real worker account, set once the farmer is connected
    // to that worker through the marketplace. Walk-in labour with no account
    // simply leaves this blank.
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true },
    workdays: [workdaySchema],
    payments: [paymentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Labour', labourSchema);
