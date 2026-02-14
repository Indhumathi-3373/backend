const express = require('express');
const users = require('./models_db/users');
const bcrypt = require('bcrypt');
const routediary = express.Router();
const cors = require('cors');

routediary.use(cors());
routediary.use(express.json());

routediary.post('/loginfordiary', async (req, res) => {
    console.log('Request body:', req.body);
    try {
        const { email, pass_diary } = req.body;

        const emailverify = await users.findOne({ email });
        console.log('User from DB:', emailverify);

        if (!emailverify) {
            return res.status(400).json({ message: "Email not registered please create an account" });
        }

        const isMatch = await bcrypt.compare(pass_diary, emailverify.pass_diary);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        res.status(200).json({ message: "Login Successful" });
    } catch (error) {
        console.error('Caught error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = routediary;


