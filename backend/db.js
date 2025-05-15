const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./storycraft.db');

// Create users and stories table if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE, 
      usernickname TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  db.run(`  
    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT CHECK(status IN ('draft', 'published')) NOT NULL DEFAULT 'draft',
      user_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

module.exports = db;
