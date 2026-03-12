const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(100)        NOT NULL,
      email      VARCHAR(150) UNIQUE NOT NULL,
      password   VARCHAR(255)        NOT NULL,
      created_at TIMESTAMPTZ         DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS categories (
      id      SERIAL PRIMARY KEY,
      user_id INTEGER      REFERENCES users(id) ON DELETE CASCADE,
      name    VARCHAR(100) NOT NULL,
      color   VARCHAR(7)   DEFAULT '#6366f1',
      icon    VARCHAR(50)  DEFAULT 'tag'
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      category_id INTEGER        REFERENCES categories(id) ON DELETE SET NULL,
      title       VARCHAR(200)   NOT NULL,
      amount      NUMERIC(10, 2) NOT NULL,
      type        VARCHAR(10)    NOT NULL CHECK (type IN ('income', 'expense')),
      date        DATE           NOT NULL,
      note        TEXT,
      created_at  TIMESTAMPTZ    DEFAULT NOW()
    );

    -- Seed default categories for new users (called per user on register)
  `);
  console.log('Database initialised');
};

module.exports = { pool, initDB };
