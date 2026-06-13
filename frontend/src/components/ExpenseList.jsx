import React from 'react';

function ExpenseList({ expenses }) {
  // Return a placeholder if no expenses are available to display
  if (!expenses || expenses.length === 0) {
    return <p style={{ textAlign: 'center', color: '#6c757d' }}>No expenses found for this group.</p>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Recent Expenses</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Date</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Description</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Paid By</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through the expense array and render each row dynamically */}
          {expenses.map((expense, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '10px' }}>{new Date(expense.date).toLocaleDateString()}</td>
              <td style={{ padding: '10px' }}>{expense.description}</td>
              <td style={{ padding: '10px' }}>{expense.paid_by}</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>
                {expense.currency} {expense.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseList;