const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: String, required: true }, // work needed on/from this date
    wageOffered: { type: Number, default: 0 },
    status: { type: String, enum: ['open', 'closed'], default: 'open' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vacancy', vacancySchema);
