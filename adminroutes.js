const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const corsOptions = require('./corsOptions');
const sessionTracker = require('./sessionTracker');

const adminRoutes = express.Router();

adminRoutes.use(cors(corsOptions));
adminRoutes.use(express.json());

adminRoutes.post('/loginforadmin', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const envEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : '';
  const envPlainPass = process.env.ADMIN_PASS || '';
  const envHashPass = process.env.ADMIN_PASS_HASH || '';

  if (!envEmail) {
    return res.status(500).json({ message: 'Admin credentials have not been configured' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailMatches = normalizedEmail === envEmail;

  let passwordMatches = false;
  if (envHashPass) {
    try {
      passwordMatches = await bcrypt.compare(password, envHashPass);
    } catch (err) {
      console.error('Failed to compare admin password hash', err);
      return res.status(500).json({ message: 'Unable to verify admin credentials' });
    }
  } else if (envPlainPass) {
    passwordMatches = password === envPlainPass;
  }

  if (!emailMatches || !passwordMatches) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  req.session.user = {
    id: 'admin',
    email: envEmail,
    scopes: ['admin']
  };
  sessionTracker.add(req.sessionID);

  return res.json({ message: 'Admin login successful' });
});

module.exports = adminRoutes;
