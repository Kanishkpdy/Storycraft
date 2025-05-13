const express = require('express');
const db = require('./db');
const router = express.Router();

// Create a new story
router.post('/stories', (req, res) => {
  const { title, content } = req.body;

  // Insert story into the database
  const query = 'INSERT INTO stories (title, content) VALUES (?, ?)';
  db.run(query, [title, content], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error adding story', error: err });
    }
    res.status(201).json({ message: 'Story added successfully', id: this.lastID });
  });
});

// Get all stories
router.get('/stories', (req, res) => {
  const query = 'SELECT * FROM stories';
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching stories', error: err });
    }
    res.json(rows);
  });
});

router.get('/stories/:id', (req, res) => {
  const storyId = req.params.id;

  const query = `SELECT * FROM stories WHERE id = ?`;
  db.get(query, [storyId], (err, row) => {
    if (err) {
      console.error('Error fetching story:', err);
      return res.status(500).json({ message: 'Error fetching story' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json(row); // Send the story as a response
  });
});



module.exports = router;
