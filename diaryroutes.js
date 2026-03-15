const express = require('express');
const cors = require('cors');
const Diary = require('./models_db/diary');

const diaryRoutes = express.Router();

diaryRoutes.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  credentials: true
}));

diaryRoutes.use(express.json());

function requireSession(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  return next();
}

diaryRoutes.get('/diary', requireSession, async (req, res) => {
  try {
    const entries = await Diary.find({ userId: req.session.user.id })
      .sort({ createdAt: -1 });
    res.json({ entries });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load entries' });
  }
});

diaryRoutes.post('/diary', requireSession, async (req, res) => {
  try {
    const { date, day, content } = req.body;
    if (!date || !day || !content) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const entry = await Diary.create({
      userId: req.session.user.id,
      date,
      day,
      content
    });
    res.status(201).json({ entry });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save entry' });
  }
});

diaryRoutes.put('/diary/:id', requireSession, async (req, res) => {
  try {
    const { date, day, content } = req.body;
    if (!date || !day || !content) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const entry = await Diary.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.user.id },
      { date, day, content },
      { new: true }
    );
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ entry });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update entry' });
  }
});

diaryRoutes.delete('/diary/:id', requireSession, async (req, res) => {
  try {
    const result = await Diary.deleteOne({ _id: req.params.id, userId: req.session.user.id });
    if (!result.deletedCount) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete entry' });
  }
});

module.exports = diaryRoutes;
