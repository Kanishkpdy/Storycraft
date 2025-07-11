const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./authroutes');
const storyRoutes = require('./storyroutes');
const userRoutes = require('./userroutes');

require('./db'); // MongoDB connection

const app = express();

// Middleware
app.use(cors({
  origin: ['https://storycraft-psi.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send(' Storycraft Backend is Running');
});

// Routes
app.use('/api', authRoutes);       // /api/register, /api/login
app.use('/api', storyRoutes);      // /api/stories etc.
app.use('/api/users', userRoutes); // /api/users/follow/:id

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
