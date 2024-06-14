const mongoose = require('mongoose');
const { Schema } = mongoose;
const UsersSchema = new Schema({
    
        name: {
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    course:{
        type:String,
        required:true
    },
    section:{
        type:String,
        required:true
    },
    branch: {
        type:String,
        required:true
    },
    classTeacher:{
        type:String,
        required:true
    }

   
  });
  let users=mongoose.model('users',UsersSchema);
  module.exports=users