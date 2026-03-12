const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { pool } = require('../db');

const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining',   color: '#f97316', icon: 'utensils' },
  { name: 'Transport',       color: '#3b82f6', icon: 'car' },
  { name: 'Shopping',        color: '#ec4899', icon: 'shopping-bag' },
  { name: 'Bills',           color: '#ef4444', icon: 'file-text' },
  { name: 'Entertainment',   color: '#a855f7', icon: 'film' },
  { name: 'Health',          color: '#22c55e', icon: 'heart' },
  { name: 'Salary',          color: '#10b981', icon: 'briefcase' },
  { name: 'Other',           color: '#6b7280', icon: 'tag' },
];

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields required' });

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length)
      return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id, name, email',
      [name, email, hashed]
    );
    const user = rows[0];

    // Seed default categories for the new user
    for (const cat of DEFAULT_CATEGORIES) {
      await pool.query(
        'INSERT INTO categories (user_id, name, color, icon) VALUES ($1,$2,$3,$4)',
        [user.id, cat.name, cat.color, cat.icon]
      );
    }

    return res.status(201).json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'All fields required' });

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    return res.json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/auth/me
const me = async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, name, email, created_at FROM users WHERE id=$1', [req.user.id]
  );
  return res.json(rows[0]);
};

module.exports = { register, login, me };
