const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const router = express.Router();

const SECRET_KEY = 'supersecretkey'; // Ideally use process.env in production

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
const isValidNickname = (nick) => /^[a-zA-Z0-9_]{3,20}$/.test(nick);

// Register
router.post('/register', async (req, res) => {
  const { username, usernickname, password } = req.body;

  if (!username || !usernickname || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (!isValidEmail(username)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (!isValidNickname(usernickname)) {
    return res.status(400).json({
      message: 'Invalid nickname. Use 3-20 characters: letters, numbers, underscores only.',
    });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { usernickname }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or nickname already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = await User.create({ username, usernickname, password: hashedPassword });

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, usernickname: newUser.usernickname },
      SECRET_KEY
    );

    res.status(201).json({ token, id: newUser._id, username, usernickname });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, username: user.username, usernickname: user.usernickname },
      SECRET_KEY
    );

    res.json({
      token,
      id: user._id,
      username: user.username,
      usernickname: user.usernickname,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
});

module.exports = router;
