// backend/db.js
const mongoose=require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/Results';

const connectToMongo = () => {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB successfully');
  }).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
};
module.exports=connectToMongo;
