const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./db');
const router = express.Router();

const SECRET_KEY = 'supersecretkey';

//  Middleware to protect routes
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

//  Get all published stories
router.get('/stories', (req, res) => {
  const query = `
    SELECT stories.*, users.username 
    FROM stories 
    LEFT JOIN users ON stories.user_id = users.id 
    WHERE status = "published" 
    ORDER BY created_at DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching stories', error: err });
    res.json(rows);
  });
});

//  Get a published story by ID
router.get('/stories/:id', (req, res) => {
  const query = `
    SELECT stories.*, users.username 
    FROM stories 
    LEFT JOIN users ON stories.user_id = users.id 
    WHERE stories.id = ? AND status = "published"
  `;
  db.get(query, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Error fetching story', error: err });
    if (!row) return res.status(404).json({ message: 'Story not found' });
    res.json(row);
  });
});

// Create a story (draft by default)
router.post('/stories', verifyToken, (req, res) => {
  const { title, content } = req.body;
  const status = 'draft';

  const query = 'INSERT INTO stories (title, content, user_id, status) VALUES (?, ?, ?, ?)';
  db.run(query, [title, content, req.user.id, status], function (err) {
    if (err) return res.status(500).json({ message: 'Error saving story', error: err });
    res.status(201).json({ id: this.lastID, message: 'Story saved as draft' });
  });
});

// Get current user's stories
router.get('/mystories', verifyToken, (req, res) => {
  const query = 'SELECT * FROM stories WHERE user_id = ? ORDER BY created_at DESC';
  db.all(query, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching your stories', error: err });
    res.json(rows);
  });
});

//  Edit a story (status defaults to draft if not passed)
router.put('/stories/:id', verifyToken, (req, res) => {
  const { title, content } = req.body;
  const status = req.body.status || 'draft';

  const query = 'UPDATE stories SET title = ?, content = ?, status = ? WHERE id = ? AND user_id = ?';
  db.run(query, [title, content, status, req.params.id, req.user.id], function (err) {
    if (err) return res.status(500).json({ message: 'Error updating story', error: err });
    if (this.changes === 0) return res.status(403).json({ message: 'Not authorized or story not found' });
    res.json({ message: 'Story updated' });
  });
});

//  Publish a story
router.put('/stories/:id/publish', verifyToken, (req, res) => {
  const query = 'UPDATE stories SET status = "published" WHERE id = ? AND user_id = ?';
  db.run(query, [req.params.id, req.user.id], function (err) {
    if (err) return res.status(500).json({ message: 'Error publishing story', error: err });
    if (this.changes === 0) return res.status(403).json({ message: 'Not authorized or story not found' });
    res.json({ message: 'Story published' });
  });
});

//  Delete a story
router.delete('/stories/:id', verifyToken, (req, res) => {
  const query = 'DELETE FROM stories WHERE id = ? AND user_id = ?';
  db.run(query, [req.params.id, req.user.id], function (err) {
    if (err) return res.status(500).json({ message: 'Error deleting story', error: err });
    if (this.changes === 0) return res.status(403).json({ message: 'Not authorized or story not found' });
    res.json({ message: 'Story deleted' });
  });
});

module.exports = router;
