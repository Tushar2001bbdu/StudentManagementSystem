const mongoose = require('mongoose');
const { Schema } = mongoose;
const DetailsSchema = new Schema({
    user:{
type:mongoose.Schema.Types.ObjectId,
ref:'user'
    },
    LibraryAvailed: {
        type:String,
        required:true
    },
    AcademicFeesPaid:{
        type:String,
        required:true
    },
    TandPFeesPaid:{
        type:String,
        required:true
    },
    TotalFeesPaid: {
        type:Number,
        required:true
    }

   
  });
  let details=mongoose.model('Details',DetailsSchema);
  module.exports=details