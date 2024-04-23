// db.ts
import mongoose from 'mongoose';

const dbURI = 'mongodb://localhost:27017/your_database_name';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as mongoose.ConnectOptions;

mongoose.connect(dbURI, options)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const db = mongoose.connection;

export default db;
