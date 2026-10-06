const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['farmer', 'worker'], required: true },
    phone: { type: String, default: '' },
    village: { type: String, default: '' },

    // Worker-only fields: whether they're currently free for work
    isAvailable: { type: Boolean, default: false },
    availabilityNote: { type: String, default: '' },
    availabilityUpdatedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

// Never send the password hash back to the client
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
