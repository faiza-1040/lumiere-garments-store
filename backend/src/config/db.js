const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    // Try to connect using the provided MONGO_URI first
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Use new URL parser and unified topology for newer drivers
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn('⚠️ Could not connect to external MongoDB. Starting in‑memory server...');
    // Spin up an in‑memory MongoDB instance (good for dev only)
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`In‑memory MongoDB started at ${uri}`);
  }
};

module.exports = connectDB;
