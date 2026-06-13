const fs = require('fs');
const csv = require('csv-parser');
const prisma = require('../config/prisma');
const expenseRepository = require('../repositories/expense.repository');
const importReportService = require('./import-report.service'); // Import add kiya

class ImportService {
  async processCSV(filePath, groupId, userId) {
    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => results.push(row))
        .on('end', async () => {
          try {
            // 1. Data clean karo
            const cleanedData = this.parseAndClean(results, groupId);
            
            // 2. Report generate karo (Requirement #6)
            const reportFileName = importReportService.generateReport(cleanedData);
            
            // 3. Database mein save karo
            await expenseRepository.bulkCreateExpenses(cleanedData, groupId);
            
            resolve({ 
              success: true, 
              count: cleanedData.length,
              report: reportFileName 
            });
          } catch (error) { 
            reject(error); 
          }
        })
        .on('error', (error) => reject(error));
    });
  }

  parseAndClean(rows, groupId) {
    return rows.map(row => {
      // Data cleaning logic...
      const amount = parseFloat(String(row.amount).replace(/,/g, '')) || 0;
      
      let date = new Date(row.date);
      if (isNaN(date.getTime())) {
        const [d, m, y] = row.date.split('-');
        date = new Date(`${y}-${m}-${d}`);
      }
      
      // Anomaly tracking ke liye flag add kiya
      const isAnomaly = !row.description || row.amount == 0;

      return {
        description: row.description || "Untitled Expense",
        paid_by: row.paid_by || "Unknown",
        amount: amount,
        currency: row.currency || "INR",
        split_type: (row.split_type || "EQUAL").toUpperCase(),
        split_with: row.split_with || "",
        date: date,
        groupId: groupId,
        notes: row.notes || "",
        isAnomaly: isAnomaly // Report ke liye
      };
    });
  }
}

module.exports = new ImportService();