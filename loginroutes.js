const express=require('express')
const users=require('./models_db/users')
const routediary=express.Router()
const cors=require('cors');
routediary.use(cors());
routediary.use(express.json());
routediary.post('/frontend/loginfordiary',async(req,res)=>{
    const {email,pass_diary}=req.body
    //console.log(req.body)
    const emailverify=await users.findOne({email})
    if(!emailverify){
        return res.json({message:"Email not registered please create an account"})
    }
    if(pass_diary!==emailverify.pass_diary){
        return res.json({message:"Incorrect Password"})
    }
res.json({message:"Login Successful"})
})

module.exports=routediary;