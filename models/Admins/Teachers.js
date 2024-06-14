const mongoose = require('mongoose');
const { Schema } = mongoose;
const TeachersSchema = new Schema({
    Teacher:{
type:mongoose.Schema.Types.ObjectId,
ref:'user'
    },
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
    age:{
        type:Number,
        required:true
    },
    gender: {
        type:String,
        required:true
    }

   
  });
  let teachers=mongoose.model('Teachers',TeachersSchema);
  module.exports=teachers