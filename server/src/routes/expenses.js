const router   = require('express').Router();
const auth     = require('../middleware/auth');
const { getExpenses, createExpense, updateExpense, deleteExpense, getSummary } = require('../controllers/expenses');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categories');

// All routes protected
router.use(auth);

// Expenses
router.get   ('/',          getExpenses);
router.post  ('/',          createExpense);
router.put   ('/:id',       updateExpense);
router.delete('/:id',       deleteExpense);
router.get   ('/summary',   getSummary);

// Categories
router.get   ('/categories',      getCategories);
router.post  ('/categories',      createCategory);
router.delete('/categories/:id',  deleteCategory);

module.exports = router;
