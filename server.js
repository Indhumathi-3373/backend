const express=require('express')
const mongoose=require('mongoose')
const router=require('./routes')
const logindiary=require('./loginroutes')
const logindoc=require('./logindoc')
const cors=require('cors')
const web=express()
web.use(cors())

web.use(express.json())
web.use(express.urlencoded({extend:true}))
web.use('/frontend', router);
web.use('/frontend', logindiary); 
web.use('/frontend', logindoc);
mongoose.connect("mongodb://localhost:27017/create_account")
.then(()=>{
    console.log("mongodb connected")
})
.catch((err)=>{
    console.log(err)
})
web.listen((8000),()=>{
    console.log("server listening")
})
