const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction
} = require('../controllers/transactionController');

// Add transaction
router.post('/add', authMiddleware, addTransaction);

// Get all transactions
router.get('/', authMiddleware, getTransactions);

// Delete transaction
router.delete('/:id', authMiddleware, deleteTransaction);

// Update transaction
router.put('/:id', authMiddleware, updateTransaction);

module.exports = router;