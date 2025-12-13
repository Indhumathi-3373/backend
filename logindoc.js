const express = require('express');
const users = require('./models_db/users');
const cors = require('cors');

const routedoc = express.Router();
routedoc.use(cors());
routedoc.use(express.json());
routedoc.use(express.urlencoded({ extended: true })); // fixed typo

routedoc.post('/loginfordocument', async (req, res) => {
    const { email, pass_doc } = req.body;  // destructure safely
    console.log(req.body);

    const emailverifydoc = await users.findOne({ email });
    if (!emailverifydoc) {
        return res.json({ message: "Email not registered, please create an account" });
    }

    if (pass_doc !== emailverifydoc.pass_doc) {
        return res.json({ message: "Incorrect password" });
    }

    return res.json({ message: "Login successful" });
});

module.exports = routedoc;
