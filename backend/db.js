const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./storycraft.db');

// Create the stories table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL
    )
  `);
});

module.exports = db;
