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
    name: { type: String, required: true, trim: true },
    workdays: [workdaySchema],
    payments: [paymentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Labour', labourSchema);
