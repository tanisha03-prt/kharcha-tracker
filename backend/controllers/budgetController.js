const Budget = require('../models/Budget');

// Set or update monthly budget
const setBudget = async (req, res) => {
  try {
    const { month, year, amount } = req.body;

    const budget = await Budget.findOneAndUpdate(
      {
        userId: req.user.id,
        month,
        year
      },
      {
        userId: req.user.id,
        month,
        year,
        amount
      },
      {
        new: true,
        upsert: true
      }
    );

    res.status(200).json({
      message: 'Budget saved successfully',
      budget
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to save budget',
      error: error.message
    });
  }
};


// Get monthly budget
const getBudget = async (req, res) => {
  try {
    const { month, year } = req.query;

    const budget = await Budget.findOne({
      userId: req.user.id,
      month,
      year
    });

    if (!budget) {
      return res.status(404).json({
        message: 'Budget not found'
      });
    }

    res.json(budget);

  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch budget',
      error: error.message
    });
  }
};


module.exports = {
  setBudget,
  getBudget
};