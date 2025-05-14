const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./authroutes');
const storyRoutes = require('./storyroutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('📘 Storycraft Backend is Running');
});

// Routes
app.use('/api', authRoutes);
app.use('/api', storyRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
