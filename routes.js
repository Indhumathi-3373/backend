const express =require('express')
const users = require('./models_db/users')
const router=express.Router()
const cors=require('cors')
router.use(cors());
router.use(express.json());
router.post('/frontend/create_account',async(req,res,next)=>{

    const {email,pass_diary,pass_doc}=req.body//getting input from body
    // console.log("form detail",req.body)
    const userexist=await users.findOne({email})
    if(userexist){
        return res.json({message:'email already registered'})
    }
        
    const createNewAccount=new users({email,pass_diary,pass_doc})
    await createNewAccount.save()
    res.json({message:"account created successfully"})
})
module.exports=router;

