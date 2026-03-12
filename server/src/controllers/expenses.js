const { pool } = require('../db');

// GET /api/expenses?month=2024-03&type=expense&category_id=2
const getExpenses = async (req, res) => {
  const { month, type, category_id } = req.query;
  const userId = req.user.id;

  let query = `
    SELECT e.*, c.name AS category_name, c.color AS category_color, c.icon AS category_icon
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.id
    WHERE e.user_id = $1
  `;
  const params = [userId];
  let idx = 2;

  if (month) {
    query += ` AND TO_CHAR(e.date, 'YYYY-MM') = $${idx++}`;
    params.push(month);
  }
  if (type) {
    query += ` AND e.type = $${idx++}`;
    params.push(type);
  }
  if (category_id) {
    query += ` AND e.category_id = $${idx++}`;
    params.push(category_id);
  }

  query += ' ORDER BY e.date DESC, e.created_at DESC';

  const { rows } = await pool.query(query, params);
  return res.json(rows);
};

// POST /api/expenses
const createExpense = async (req, res) => {
  const { title, amount, type, date, category_id, note } = req.body;
  if (!title || !amount || !type || !date)
    return res.status(400).json({ message: 'title, amount, type, date are required' });

  const { rows } = await pool.query(
    `INSERT INTO expenses (user_id, category_id, title, amount, type, date, note)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [req.user.id, category_id || null, title, amount, type, date, note || null]
  );
  return res.status(201).json(rows[0]);
};

// PUT /api/expenses/:id
const updateExpense = async (req, res) => {
  const { title, amount, type, date, category_id, note } = req.body;
  const { rows } = await pool.query(
    `UPDATE expenses SET title=$1, amount=$2, type=$3, date=$4, category_id=$5, note=$6
     WHERE id=$7 AND user_id=$8 RETURNING *`,
    [title, amount, type, date, category_id || null, note || null, req.params.id, req.user.id]
  );
  if (!rows.length) return res.status(404).json({ message: 'Expense not found' });
  return res.json(rows[0]);
};

// DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  const { rowCount } = await pool.query(
    'DELETE FROM expenses WHERE id=$1 AND user_id=$2',
    [req.params.id, req.user.id]
  );
  if (!rowCount) return res.status(404).json({ message: 'Expense not found' });
  return res.json({ message: 'Deleted' });
};

// GET /api/expenses/summary?month=2024-03
// Returns: total income, total expense, balance, breakdown by category
const getSummary = async (req, res) => {
  const { month } = req.query;
  const userId = req.user.id;

  const params = [userId];
  let monthFilter = '';
  if (month) {
    monthFilter = `AND TO_CHAR(date, 'YYYY-MM') = $2`;
    params.push(month);
  }

  // Totals
  const totals = await pool.query(
    `SELECT
       COALESCE(SUM(CASE WHEN type='income'  THEN amount END), 0) AS total_income,
       COALESCE(SUM(CASE WHEN type='expense' THEN amount END), 0) AS total_expense
     FROM expenses WHERE user_id=$1 ${monthFilter}`,
    params
  );

  // Category breakdown (expenses only)
  const breakdown = await pool.query(
    `SELECT c.name, c.color, c.icon,
            COALESCE(SUM(e.amount), 0) AS total
     FROM categories c
     LEFT JOIN expenses e ON e.category_id = c.id AND e.type='expense'
       AND e.user_id=$1 ${monthFilter ? `AND TO_CHAR(e.date,'YYYY-MM')=$2` : ''}
     WHERE c.user_id=$1
     GROUP BY c.id, c.name, c.color, c.icon
     ORDER BY total DESC`,
    params
  );

  // Monthly trend (last 6 months)
  const trend = await pool.query(
    `SELECT TO_CHAR(date,'YYYY-MM') AS month,
            COALESCE(SUM(CASE WHEN type='income'  THEN amount END),0) AS income,
            COALESCE(SUM(CASE WHEN type='expense' THEN amount END),0) AS expense
     FROM expenses WHERE user_id=$1
       AND date >= NOW() - INTERVAL '6 months'
     GROUP BY TO_CHAR(date,'YYYY-MM')
     ORDER BY month ASC`,
    [userId]
  );

  const { total_income, total_expense } = totals.rows[0];
  return res.json({
    total_income:  parseFloat(total_income),
    total_expense: parseFloat(total_expense),
    balance:       parseFloat(total_income) - parseFloat(total_expense),
    breakdown:     breakdown.rows,
    trend:         trend.rows
  });
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense, getSummary };
