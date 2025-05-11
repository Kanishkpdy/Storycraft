// backend/models.js
const db = require('./db');

// Create the stories table if it doesn't exist
const createTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL
    )
  `;

  db.run(query, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Stories table created successfully (or already exists).');
    }
  });
};

createTable();
