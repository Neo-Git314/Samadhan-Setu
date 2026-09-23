import mongoose from 'mongoose';

/**
 * Connects to MongoDB database using MONGODB_URI environment variable.
 * Provides explicit connection and error logging.
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/samadhan_setu';

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database] MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

// Monitor ongoing connection events
mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB connection lost. Disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database] MongoDB runtime error: ${err.message}`);
});

export default connectDB;
