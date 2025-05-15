const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const router = express.Router();

const SECRET_KEY = 'supersecretkey'; // Use .env in real apps
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
const isValidNickname = (nick) => /^[a-zA-Z0-9_]{3,20}$/.test(nick);

router.post('/register', (req, res) => {
  const { username, usernickname, password } = req.body;

  if (!username || !usernickname || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (!isValidEmail(username)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (!isValidNickname(usernickname)) {
    return res.status(400).json({ message: 'Invalid nickname. Use 3-20 characters: letters, numbers, underscores only.' });
  }
  const hashedPassword = bcrypt.hashSync(password, 8);
  const query = 'INSERT INTO users (username, usernickname, password) VALUES (?, ?, ?)';
  db.run(query, [username, usernickname, hashedPassword], function (err) {
    if (err) {
      return res.status(400).json({ message: 'Email or nickname already exists' });
    }
    const token = jwt.sign({ id: this.lastID, username, usernickname }, SECRET_KEY);
    res.status(201).json({ token, id: this.lastID, username, usernickname });
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

    const token = jwt.sign(
      { id: user.id, username: user.username, usernickname: user.usernickname },
      SECRET_KEY
    );

    res.json({
      token,
      id: user.id,
      username: user.username,
      usernickname: user.usernickname // ✅ Now included in the response
    });
  });
});


module.exports = router;
