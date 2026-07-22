const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  flow: { type: String, enum: ['light', 'medium', 'heavy', 'spotting'] },
  symptoms: [String],
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Period', periodSchema);