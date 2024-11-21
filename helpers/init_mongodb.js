import mongoose from 'mongoose';
mongoose.set('strictQuery', true);
const initMongoDB = async () => {
  try {
    const username = 'doadmin';
    const password = 'w5m2y71YKh693CF8';
    const host = 'db-mongodb-blr1-77176-fa6e6fa7.mongo.ondigitalocean.com';
    const database = 'admin';
    // Construct the MongoDB URI
    const mongoDB = `mongodb+srv://${username}:${encodeURIComponent(password)}@${host}/${database}?retryWrites=true&w=majority`;
    // Connect to MongoDB using the latest mongoose features
    await mongoose.connect(mongoDB);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
    process.exit(1);
  }
};
export default initMongoDB;