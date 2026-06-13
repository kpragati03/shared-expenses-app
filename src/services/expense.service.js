class ExpenseService {
  calculateSplit(amount, splitType, participants) {
    // participants format: [{ userId: '...', shares: 1, percentage: 25 }]
    const splits = [];
    
    if (splitType === 'EQUAL') {
      const perPerson = amount / participants.length;
      participants.forEach(p => splits.push({ userId: p.userId, owedAmount: perPerson }));
    } 
    else if (splitType === 'PERCENTAGE') {
      participants.forEach(p => splits.push({ userId: p.userId, owedAmount: (amount * p.percentage) / 100 }));
    }
    else if (splitType === 'SHARE') {
      const totalShares = participants.reduce((acc, p) => acc + p.shares, 0);
      participants.forEach(p => splits.push({ userId: p.userId, owedAmount: (amount * p.shares) / totalShares }));
    }
    
    return splits;
  }
}

module.exports = new ExpenseService();