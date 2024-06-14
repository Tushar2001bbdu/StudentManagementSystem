const mongoose=require('mongoose')
const MONGURI="mongodb://localhost:27017/Results"
const connectToMongo =()=>{
    mongoose.connect(MONGURI)
}
module.exports=connectToMongo