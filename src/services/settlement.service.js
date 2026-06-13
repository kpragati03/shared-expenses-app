const prisma = require('../config/prisma');

class SettlementService {
  async settleDebt(paidById, paidToId, groupId, amount, currency) {
    return await prisma.settlement.create({
      data: {
        groupId,
        paidById,
        paidToId,
        amount: amount.toString(),
        currency,
        transactionDate: new Date(),
        notes: "Settlement payment"
      }
    });
  }
}

module.exports = new SettlementService();