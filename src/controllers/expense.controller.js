const prisma = require('../config/prisma');
const balanceService = require('../services/balance.service');

class ExpenseController {
  async getGroupExpenses(req, res) {
    const { groupId } = req.params;
    try {
      // Expenses fetch karo
      const expenses = await prisma.expense.findMany({
        where: { groupId: groupId },
        include: { 
          paidBy: { select: { name: true } },
          splits: { include: { user: { select: { name: true } } } }
        },
        orderBy: { transactionDate: 'desc' }
      });

      // Balances calculate karo
      const balances = await balanceService.getGroupBalances(groupId);

      res.status(200).json({
        success: true,
        data: {
          expenses,
          balances
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching expenses and balances',
        error: error.message
      });
    }
  }
}

module.exports = new ExpenseController();