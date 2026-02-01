const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db = null;

const DATABASE_PATH = process.env.DATABASE_URL?.replace('sqlite:', '') || path.join(__dirname, '..', 'adsfsa.db');

function init() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DATABASE_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database:', DATABASE_PATH);

      // Create tables if they don't exist
      createTables()
        .then(() => {
          console.log('Database tables initialized');
          resolve();
        })
        .catch(reject);
    });
  });
}

function createTables() {
  return new Promise((resolve, reject) => {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createItemsTable = `
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `;

    db.serialize(() => {
      db.run(createUsersTable, (err) => {
        if (err) {
          console.error('Error creating users table:', err.message);
          reject(err);
          return;
        }
      });

      db.run(createItemsTable, (err) => {
        if (err) {
          console.error('Error creating items table:', err.message);
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
}

function getDb() {
  return db;
}

function close() {
  return new Promise((resolve) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed');
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  init,
  getDb,
  close
};