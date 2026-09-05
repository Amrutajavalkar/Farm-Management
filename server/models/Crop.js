const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    seedPrice: { type: Number, default: 0, min: 0 },
    labourAmount: { type: Number, default: 0, min: 0 },
    fertilizerAmount: { type: Number, default: 0, min: 0 },
    sprayAmount: { type: Number, default: 0, min: 0 },
    otherAmount: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);
// Modoule.exports = mongoose.model('Crop', cropSchema);
module.exports =  mongoose.model('Crop', cropSchema);
