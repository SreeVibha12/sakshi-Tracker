const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  waterIntake: Number,
  sleepHours: Number,
  mood: String
}, { timestamps: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);