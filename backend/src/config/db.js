const mongoose = require('mongoose');

/**
 * Connect to MongoDB instance using connection URI specified in environment variables.
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lead_manager';
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });

    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.error(`[Database Tip] Ensure MongoDB is running locally or provide a valid MongoDB Atlas connection string in backend/.env`);
    // In development, we allow the server to remain alive for health checks, but log prominently
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
