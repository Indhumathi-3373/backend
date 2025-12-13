
const mongoose=require('mongoose')
const userSchema = new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    pass_diary:{type:String ,required:true},
    pass_doc:{type:String ,required:true}
})

module.exports=mongoose.model("users_account",userSchema);