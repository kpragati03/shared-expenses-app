import React from 'react';

function ExpenseList({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return <p style={{ textAlign: 'center', color: '#6c757d' }}>No expenses found for this group.</p>;
  }

  return (
    <div style={{ marginTop: '20px', overflowX: 'auto' }}>
      <h3>Recent Expenses</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ backgroundColor: '#e9ecef' }}>
            <th style={{ padding: '12px 10px', borderBottom: '2px solid #dee2e6', textAlign: 'left', width: '15%' }}>Date</th>
            <th style={{ padding: '12px 10px', borderBottom: '2px solid #dee2e6', textAlign: 'left', width: '30%' }}>Description</th>
            <th style={{ padding: '12px 10px', borderBottom: '2px solid #dee2e6', textAlign: 'left', width: '15%' }}>Split</th>
            <th style={{ padding: '12px 10px', borderBottom: '2px solid #dee2e6', textAlign: 'left', width: '20%' }}>Paid By</th>
            <th style={{ padding: '12px 10px', borderBottom: '2px solid #dee2e6', textAlign: 'right', width: '20%' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => {
            const expenseDate = expense.transactionDate || expense.date;
            const formattedDate = expenseDate ? new Date(expenseDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
            const paidByName = expense.paidBy?.name || expense.paidBy || expense.paid_by || 'Unknown';
            const formattedAmount = parseFloat(expense.amount || 0).toFixed(2);

            return (
              <tr key={index} style={{ borderBottom: '1px solid #dee2e6', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                <td style={{ padding: '12px 10px', textAlign: 'left' }}>{formattedDate}</td>
                <td style={{ padding: '12px 10px', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{expense.description}</td>
                <td style={{ padding: '12px 10px', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#e9ecef', padding: '2px 6px', borderRadius: '4px' }}>
                    {expense.splitType || 'EQUAL'}
                  </span>
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'left' }}>{paidByName}</td>
                <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 'bold', color: '#198754' }}>{expense.currency} {formattedAmount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseList;