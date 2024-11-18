import mongoose from 'mongoose';

const initMongoDB = async () => {
  try {
    const url = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME;
    const mongoDB = `${url}${dbName}`;
    await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
    process.exit(1);
  }
};

export default initMongoDB;

