const mongoose = require('mongoose');
const { Schema } = mongoose;
const DetailsSchema = new Schema({
    
    rollno:{
        type:Number,
        required:true,
        unique:true
    },
    LibraryAvailed: {
        type:String,
        default:"NA",
        required:true
    },
    AcademicFeesPaid:{
        type:String,
        default:0,
        required:true
    },
    TandPFeesPaid:{
        type:String,
        default:0,
        required:true
    },
    TotalFeesPaid: {
        type:Number,
        default:0,
        required:true
    }

   
  });
  let details=mongoose.model('Details',DetailsSchema);
  module.exports=details