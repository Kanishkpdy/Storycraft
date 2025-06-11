const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Story = require('./models/Story');
const User = require('./models/User');

const SECRET_KEY = 'supersecretkey';

// Middleware to verify token
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

// ✅ Get all published stories
router.get('/stories', async (req, res) => {
  try {
    const stories = await Story.find({ status: 'published' })
      .sort({ created_at: -1 })
      .populate('user_id', 'username');
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stories', error: err });
  }
});

// ✅ Get single published story by ID
router.get('/stories/:id', async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id, status: 'published' })
      .populate('user_id', 'username usernickname'); // <-- this is essential
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching story', error: err });
  }
});


// ✅ Save a new story as draft (protected)
router.post('/stories', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const story = new Story({
      title,
      content,
      status: 'draft',
      user_id: req.user.id
    });
    await story.save();
    res.status(201).json({ id: story._id, message: 'Story saved as draft' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving story', error: err });
  }
});

// ✅ Get all stories of logged-in user (protected)
router.get('/mystories', verifyToken, async (req, res) => {
  try {
    const stories = await Story.find({ user_id: req.user.id }).sort({ created_at: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your stories', error: err });
  }
});

// ✅ Update a story (protected)
router.put('/stories/:id', verifyToken, async (req, res) => {
  try {
    const { title, content, status = 'draft' } = req.body;
    const updated = await Story.updateOne(
      { _id: req.params.id, user_id: req.user.id },
      { title, content, status }
    );
    if (updated.modifiedCount === 0) {
      return res.status(403).json({ message: 'Not authorized or story not found' });
    }
    res.json({ message: 'Story updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating story', error: err });
  }
});

// ✅ Publish a story (protected)
router.put('/stories/:id/publish', verifyToken, async (req, res) => {
  try {
    const result = await Story.updateOne(
      { _id: req.params.id, user_id: req.user.id },
      { status: 'published' }
    );
    if (result.modifiedCount === 0) {
      return res.status(403).json({ message: 'Not authorized or story not found' });
    }
    res.json({ message: 'Story published' });
  } catch (err) {
    res.status(500).json({ message: 'Error publishing story', error: err });
  }
});

// ✅ Delete a story (protected)
router.delete('/stories/:id', verifyToken, async (req, res) => {
  try {
    const result = await Story.deleteOne({ _id: req.params.id, user_id: req.user.id });
    if (result.deletedCount === 0) {
      return res.status(403).json({ message: 'Not authorized or story not found' });
    }
    res.json({ message: 'Story deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting story', error: err });
  }
});

module.exports = router;
