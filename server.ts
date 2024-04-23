import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './authRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', authRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Define login route handler
app.post('/api/login', (req, res) => {
  // Example logic: Check if username and password match in the database
  // Replace this with your actual database logic using Mongoose

  // Extract username and password from request body
  const { username, password } = req.body;

  // Example: Check if the username and password match a record in the database
  if (username === 'testuser' && password === 'testpassword') {
    // If credentials are valid, send a success response
    res.status(200).json({ success: true, message: 'Login successful' });
  } else {
    // If credentials are invalid, send an error response
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
