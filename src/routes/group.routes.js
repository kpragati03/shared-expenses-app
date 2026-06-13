const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');
const expenseController = require('../controllers/expense.controller');
const { protect } = require('../middlewares/auth.middleware');

// Saare group routes protected hain (login zaruri hai)
router.use(protect);

// Group management routes
router.post('/', groupController.create);
router.get('/:id', groupController.getById);

// Expense management routes
router.get('/:groupId/expenses', expenseController.getGroupExpenses);

// Dashboard / Balance summary route
router.get('/:id/dashboard', groupController.getGroupDashboard);

module.exports = router;