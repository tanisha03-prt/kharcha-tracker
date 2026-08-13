const Transaction = require('../models/Transaction');

// Add transaction
const addTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    const transaction = await Transaction.create({
      userId: req.user.id,
      amount,
      type,
      category,
      description,
      date
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to add transaction',
      error: error.message
    });
  }
};

// Get all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id
    }).sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        message: 'Transaction not found'
      });
    }

    res.json({
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete transaction',
      error: error.message
    });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  deleteTransaction
};