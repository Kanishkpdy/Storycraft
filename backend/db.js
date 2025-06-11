const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://KP:r757L4htbqGvStW6@storycraft.n2acyhr.mongodb.net/?retryWrites=true&w=majority&appName=Storycraft';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

module.exports = mongoose;
