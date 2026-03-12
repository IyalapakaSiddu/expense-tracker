const { pool } = require('../db');

const getCategories = async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM categories WHERE user_id=$1 ORDER BY name',
    [req.user.id]
  );
  return res.json(rows);
};

const createCategory = async (req, res) => {
  const { name, color, icon } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  const { rows } = await pool.query(
    'INSERT INTO categories (user_id, name, color, icon) VALUES ($1,$2,$3,$4) RETURNING *',
    [req.user.id, name, color || '#6366f1', icon || 'tag']
  );
  return res.status(201).json(rows[0]);
};

const deleteCategory = async (req, res) => {
  const { rowCount } = await pool.query(
    'DELETE FROM categories WHERE id=$1 AND user_id=$2',
    [req.params.id, req.user.id]
  );
  if (!rowCount) return res.status(404).json({ message: 'Category not found' });
  return res.json({ message: 'Deleted' });
};

module.exports = { getCategories, createCategory, deleteCategory };
