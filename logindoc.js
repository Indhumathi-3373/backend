const express = require('express');
const users = require('./models_db/users');
const cors = require('cors');
const corsOptions = require('./corsOptions');
const routedoc = express.Router();
const bcrypt=require('bcrypt');
const sessionTracker = require('./sessionTracker');
routedoc.use(cors(corsOptions));
routedoc.use(express.json());
routedoc.use(express.urlencoded({ extended: true }));

routedoc.post('/loginfordocument', async (req, res) => {
    const { email, pass_doc } = req.body;  
   

    const emailverifydoc = await users.findOne({ email });
    if (!emailverifydoc) {
        return res.json({ message: "Email not registered, please create an account" });
    }

    const isMatch = await bcrypt.compare(pass_doc, emailverifydoc.pass_doc);
if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const existingUser = req.session.user;
    const scopes = Array.isArray(existingUser?.scopes)
        ? existingUser.scopes
        : (existingUser?.scope ? [existingUser.scope] : []);
    if (!scopes.includes("document")) {
        scopes.push("document");
    }
    req.session.user = {
        id: emailverifydoc._id.toString(),
        email: emailverifydoc.email,
        scopes
    };
    sessionTracker.add(req.sessionID);
    return res.json({ message: "Login successful" });
});

module.exports = routedoc;
