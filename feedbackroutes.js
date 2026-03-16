const express = require('express');
const cors = require('cors');
const corsOptions = require('./corsOptions');
const Feedback = require('./models_db/feedback');

const feedbackRoutes = express.Router();

feedbackRoutes.use(cors(corsOptions));

feedbackRoutes.use(express.json());

feedbackRoutes.post('/feedback', async (req, res) => {
  try {
    const { name, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const entry = await Feedback.create({ name, message });
    res.status(201).json({ feedback: entry });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save feedback' });
  }
});

feedbackRoutes.get('/admin/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find({})
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ feedback });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load feedback' });
  }
});

module.exports = feedbackRoutes;
