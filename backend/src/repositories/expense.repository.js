const prisma = require('../config/prisma');

class ExpenseRepository {
  async bulkCreateExpenses(expenses, groupId) {
    const results = [];
    
    // Mapping CSV values to Prisma Enum values
    const splitTypeMap = {
      'EQUAL': 'EQUAL',
      'PERCENTAGE': 'PERCENTAGE',
      'SHARE': 'SHARE',
      'EXACT': 'EXACT',
      'UNEQUAL': 'EQUAL' // Default fallback for unsupported types
    };

    for (const exp of expenses) {
      const user = await prisma.user.findFirst({ where: { name: exp.paid_by } });
      const paidById = user ? user.id : '6c794694-c579-473f-9ca4-8744c0d8bb71';

      results.push(await prisma.expense.create({
        data: {
          groupId: groupId,
          paidById: paidById,
          description: exp.description,
          amount: exp.amount.toString(),
          currency: exp.currency,
          baseCurrencyAmount: exp.amount.toString(),
          // Mapping apply kar rahe hain yahan:
          splitType: splitTypeMap[exp.split_type.toUpperCase()] || 'EQUAL',
          transactionDate: new Date(exp.date),
          notes: exp.notes
        }
      }));
    }
    return results;
  }
}

module.exports = new ExpenseRepository();