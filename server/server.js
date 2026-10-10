import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const port = process.env.PORT || 3000;

try {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection;
  const collection = db.collection('tasks');
  console.log('Successfully connected to MongoDB Atlas!');

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
} catch (err) {
  console.error('Server startup failed:', err);
  process.exit(1);
}
