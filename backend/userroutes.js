const express = require('express');
const router = express.Router();
const User = require('./models/User');
const Story = require('./models/Story');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'supersecretkey';

// 🔒 Middleware: JWT auth
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// 🔁 Follow/Unfollow user
router.post('/follow/:id', verifyToken, async (req, res) => {
  const currentUserId = req.user.id;
  const targetId = req.params.id;

  if (currentUserId === targetId) {
    return res.status(400).json({ message: 'You cannot follow yourself' });
  }

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetId);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const isFollowing = currentUser.following.includes(targetId);

    if (!isFollowing) {
      currentUser.following.push(targetId);
      targetUser.followers.push(currentUserId);
    } else {
      currentUser.following.pull(targetId);
      targetUser.followers.pull(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({ following: !isFollowing });
  } catch (err) {
    console.error('Follow error:', err);
    res.status(500).json({ message: 'Follow/unfollow error', error: err });
  }
});

// 👤 Get Profile + Stories
router.get('/:id', async (req, res) => {
  try {
    const author = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'usernickname _id')
      .populate('following', 'usernickname _id');

    if (!author) return res.status(404).json({ message: 'User not found' });

    const stories = await Story.find({ user_id: req.params.id });

    res.json({ author, stories });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: 'Error fetching profile', error: err });
  }
});

module.exports = router;
