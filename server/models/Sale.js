const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
    buyerName: { type: String, required: true, trim: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    weight: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ['kg', 'quintal', 'ton'], default: 'quintal' },
    pricePerUnit: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 } // weight * pricePerUnit, computed server-side
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);
