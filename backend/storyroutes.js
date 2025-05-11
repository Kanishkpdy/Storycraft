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

module.exports = router;
