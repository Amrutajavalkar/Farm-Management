const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
=======
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
    name: { type: String, required: true, trim: true },
    seedPrice: { type: Number, default: 0, min: 0 },
    labourAmount: { type: Number, default: 0, min: 0 },
    fertilizerAmount: { type: Number, default: 0, min: 0 },
    sprayAmount: { type: Number, default: 0, min: 0 },
    otherAmount: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);
<<<<<<< HEAD

module.exports = mongoose.model('Crop', cropSchema);
=======
// Modoule.exports = mongoose.model('Crop', cropSchema);
module.exports =  mongoose.model('Crop', cropSchema);
>>>>>>> 6e81af9bb39373b3332805e2a909331226134f69
