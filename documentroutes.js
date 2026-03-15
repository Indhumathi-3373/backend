const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Document = require('./models_db/document');

const documentRoutes = express.Router();

documentRoutes.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  credentials: true
}));

documentRoutes.use(express.json());

documentRoutes.use((req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  return next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${unique}-${safeName}`);
  }
});

const upload = multer({ storage });

documentRoutes.get('/documents', async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.session.user.id })
      .sort({ uploadedAt: -1 });
    res.json({ documents: docs });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load documents' });
  }
});

documentRoutes.post('/documents', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const doc = await Document.create({
      userId: req.session.user.id,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      fileUrl
    });

    res.status(201).json({ document: doc });
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload document' });
  }
});

documentRoutes.delete('/documents/:id', async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, userId: req.session.user.id });
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const fullPath = path.join(__dirname, 'uploads', doc.storedName);
    fs.unlink(fullPath, () => {});
    await Document.deleteOne({ _id: req.params.id, userId: req.session.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete document' });
  }
});

module.exports = documentRoutes;
