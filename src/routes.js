const express = require('express');
const database = require('./database');
const router = express.Router();

// Get all users
router.get('/users', (req, res) => {
  const db = database.getDb();
  const sql = 'SELECT * FROM users ORDER BY created_at DESC';

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  });
});

// Get user by ID
router.get('/users/:id', (req, res) => {
  const db = database.getDb();
  const sql = 'SELECT * FROM users WHERE id = ?';

  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({
      success: true,
      data: row
    });
  });
});

// Create new user
router.post('/users', (req, res) => {
  const db = database.getDb();
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';

  db.run(sql, [name, email], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(409).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    res.status(201).json({
      success: true,
      data: {
        id: this.lastID,
        name,
        email
      }
    });
  });
});

// Update user
router.put('/users/:id', (req, res) => {
  const db = database.getDb();
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  const sql = 'UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';

  db.run(sql, [name, email, req.params.id], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(409).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({
      success: true,
      message: 'User updated successfully'
    });
  });
});

// Delete user
router.delete('/users/:id', (req, res) => {
  const db = database.getDb();
  const sql = 'DELETE FROM users WHERE id = ?';

  db.run(sql, [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  });
});

// Get all items
router.get('/items', (req, res) => {
  const db = database.getDb();
  const sql = `
    SELECT i.*, u.name as user_name, u.email as user_email
    FROM items i
    LEFT JOIN users u ON i.user_id = u.id
    ORDER BY i.created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  });
});

// Get item by ID
router.get('/items/:id', (req, res) => {
  const db = database.getDb();
  const sql = `
    SELECT i.*, u.name as user_name, u.email as user_email
    FROM items i
    LEFT JOIN users u ON i.user_id = u.id
    WHERE i.id = ?
  `;

  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({
      success: true,
      data: row
    });
  });
});

// Create new item
router.post('/items', (req, res) => {
  const db = database.getDb();
  const { title, description, user_id } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  const sql = 'INSERT INTO items (title, description, user_id) VALUES (?, ?, ?)';

  db.run(sql, [title, description || null, user_id || null], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({
      success: true,
      data: {
        id: this.lastID,
        title,
        description,
        user_id
      }
    });
  });
});

// Update item
router.put('/items/:id', (req, res) => {
  const db = database.getDb();
  const { title, description, user_id } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  const sql = 'UPDATE items SET title = ?, description = ?, user_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';

  db.run(sql, [title, description || null, user_id || null, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({
      success: true,
      message: 'Item updated successfully'
    });
  });
});

// Delete item
router.delete('/items/:id', (req, res) => {
  const db = database.getDb();
  const sql = 'DELETE FROM items WHERE id = ?';

  db.run(sql, [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  });
});

module.exports = router;