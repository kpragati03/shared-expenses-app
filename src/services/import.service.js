const fs = require('fs');
const csv = require('csv-parser');
const prisma = require('../config/prisma');
const expenseRepository = require('../repositories/expense.repository');
const importReportService = require('./import-report.service');

class ImportService {
  /**
   * Process a CSV file and store expenses in the database
   * @param {string} filePath 
   * @param {string} groupId 
   * @param {string} userId 
   */
  async processCSV(filePath, groupId, userId) {
    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => results.push(row))
        .on('end', async () => {
          try {
            // Clean and parse the raw CSV data
            const cleanedData = this.parseAndClean(results, groupId);
            
            // Generate an import report to track anomalies
            const reportFileName = importReportService.generateReport(cleanedData);
            
            // Persist the sanitized data to the database
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

  /**
   * Transform and validate raw CSV rows
   * @param {Array} rows 
   * @param {string} groupId 
   */
  parseAndClean(rows, groupId) {
    return rows.map(row => {
      // Normalize amount and handle currency formatting
      const amount = parseFloat(String(row.amount).replace(/,/g, '')) || 0;
      
      // Parse date with fallback for DD-MM-YYYY format
      let date = new Date(row.date);
      if (isNaN(date.getTime())) {
        const [d, m, y] = row.date.split('-');
        date = new Date(`${y}-${m}-${d}`);
      }
      
      // Mark as anomaly if critical information is missing or amount is invalid
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
        isAnomaly: isAnomaly
      };
    });
  }
}

module.exports = new ImportService();