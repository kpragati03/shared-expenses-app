const prisma = require('../config/prisma');

class BalanceService {
  async getGroupBalances(groupId) {
    const expenses = await prisma.expense.findMany({
      where: { groupId },
      include: { splits: true }
    });

    const balances = {};

    for (const expense of expenses) {
      const payerId = expense.paidById;
      const totalAmount = Number(expense.amount);

      if (!balances[payerId]) balances[payerId] = 0;
      balances[payerId] += totalAmount;

      for (const split of expense.splits) {
        const userId = split.userId;
        const owed = Number(split.owedAmount);

        if (!balances[userId]) balances[userId] = 0;
        balances[userId] -= owed;
      }
    }
    return balances;
  }
}

module.exports = new BalanceService();