const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users_account', required: true },
  date: { type: String, required: true },
  day: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('diary_entries', diarySchema);
