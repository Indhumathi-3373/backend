const express = require('express');
const users = require('./models_db/users');
const cors = require('cors');
const routedoc = express.Router();
const bcrypt=require('bcrypt');
routedoc.use(cors());
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


    return res.json({ message: "Login successful" });
});

module.exports = routedoc;
