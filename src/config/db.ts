import mongoose from 'mongoose';
import assert from 'node:assert';

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/template-development';

  try {

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (err) {
    assert.fail(`MongoDB connection error. Exiting application with error Message: ${err}`);
  }
};

export default connectDB;

