const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResultsSchema = new Schema({
    user:{
        type:String,
        ref:'user',
        unique:true
            },
    
    name: {
        type:String,
        required:true
    },
    marks: {
        type:String,
        required:true,
        unique:false
    },
    grade: {
        type:String,
        default:"F"
    },
    attendance:{
        type:Number,
        default:0
    }

   
  });
  let Results=mongoose.model('result',ResultsSchema);
  
  module.exports=Results