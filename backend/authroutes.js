const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const router = express.Router();

const SECRET_KEY = 'supersecretkey'; // Use .env in real apps

// Register
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.run(query, [username, hashedPassword], function (err) {
    if (err) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const token = jwt.sign({ id: this.lastID, username }, SECRET_KEY);
    res.status(201).json({ token, id: this.lastID, username });
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);
    res.json({ token, id: user.id, username: user.username });
  });
});

module.exports = router;
