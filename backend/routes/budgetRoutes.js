const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
  setBudget,
  getBudget
} = require('../controllers/budgetController');


// Set / update budget
router.post('/', authMiddleware, setBudget);


// Get budget
router.get('/', authMiddleware, getBudget);


module.exports = router;