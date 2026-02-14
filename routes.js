const express =require('express')
const users = require('./models_db/users')
const router=express.Router()
const cors=require('cors')
const bcrypt=require('bcrypt')
router.use(cors());
router.use(express.json());
router.post('/create_account', async (req, res) => {
    const { email, pass_diary, pass_doc } = req.body;
    const userexist = await users.findOne({ email });
    if (userexist) return res.json({ message: 'email already registered' });
const hasheddiary=await bcrypt.hash(pass_diary,12);
const hasheddoc=await bcrypt.hash(pass_doc,12);
    const createNewAccount = new users({ email, pass_diary:hasheddiary, pass_doc:hasheddoc });
    await createNewAccount.save();
    res.json({ message: 'account created successfully' });
});
module.exports=router;

