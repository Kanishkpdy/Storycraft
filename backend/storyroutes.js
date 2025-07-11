const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Story = require('./models/Story');
const User = require('./models/User');

const SECRET_KEY = 'supersecretkey';

// Middleware to verify JWT token
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

// 📚 Get all published stories
router.get('/stories', async (req, res) => {
  try {
    const stories = await Story.find({ status: 'published' })
      .sort({ created_at: -1 })
      .populate('user_id', 'username usernickname');
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stories', error: err });
  }
});

// 🔍 Search by title or tags
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'No search query provided' });

  const regex = new RegExp(q, 'i');
  try {
    const stories = await Story.find({
      status: 'published',
      $or: [{ title: regex }, { tags: regex }]
    }).populate('user_id', 'username usernickname');

    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err });
  }
});

// 📖 Get single published story by ID
router.get('/stories/:id', async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id, status: 'published' })
      .populate('user_id', 'username usernickname');
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching story', error: err });
  }
});

// 👤 Get profile info and all their public stories
router.get('/profile/:id', async (req, res) => {
  try {
    const author = await User.findById(req.params.id).select('-password');
    if (!author) return res.status(404).json({ message: 'Author not found' });

    const stories = await Story.find({ user_id: req.params.id, status: 'published' })
      .sort({ created_at: -1 });

    res.json({ author, stories });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err });
  }
});

// ✍️ Save a new story as draft
router.post('/stories', verifyToken, async (req, res) => {
  try {
    const { title, content, tags = [] } = req.body;
    const story = new Story({
      title,
      content,
      tags,
      status: 'draft',
      user_id: req.user.id
    });
    await story.save();
    res.status(201).json({ id: story._id, message: 'Story saved as draft' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving story', error: err });
  }
});

// 📋 Get all stories of the logged-in user
router.get('/mystories', verifyToken, async (req, res) => {
  try {
    const stories = await Story.find({ user_id: req.user.id }).sort({ created_at: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your stories', error: err });
  }
});

// 🛠️ Update a story (title/content/status/tags)
router.put('/stories/:id', verifyToken, async (req, res) => {
  try {
    const { title, content, status = 'draft', tags = [] } = req.body;
    const updated = await Story.updateOne(
      { _id: req.params.id, user_id: req.user.id },
      { title, content, status, tags, updated_at: new Date() }
    );
    if (updated.modifiedCount === 0) {
      return res.status(403).json({ message: 'Not authorized or story not found' });
    }
    res.json({ message: 'Story updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating story', error: err });
  }
});

// 🚀 Publish a story
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

// ❌ Delete a story
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

// ❤️ Like or Unlike a story
// ❤️ Like or Unlike a story
router.post('/stories/:id/like', verifyToken, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    const userId = req.user.id;
    const index = story.likes.indexOf(userId);

    if (index === -1) {
      story.likes.push(userId); // 👍 Like
    } else {
      story.likes.splice(index, 1); // 👎 Unlike
    }

    await story.save();
    res.json({ likes: story.likes }); // ✅ return full array, not length
  } catch (err) {
    res.status(500).json({ message: 'Error liking/unliking story', error: err });
  }
});


// ➕ Follow or unfollow a user
router.post('/follow/:id', verifyToken, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = targetUser.followers.indexOf(currentUser._id);
    if (index === -1) {
      targetUser.followers.push(currentUser._id);
    } else {
      targetUser.followers.splice(index, 1);
    }

    await targetUser.save();
    res.json({ followersCount: targetUser.followers.length });
  } catch (err) {
    res.status(500).json({ message: 'Error following/unfollowing', error: err });
  }
});

module.exports = router;
