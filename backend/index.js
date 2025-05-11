const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const storyRoutes = require('./storyroutes');  // Import story routes

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON requests

// Root route (to test if the server is running)
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Use the routes for stories API
app.use('/api', storyRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
