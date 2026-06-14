const prisma = require('../config/prisma');
const fs = require('fs');
const csv = require('csv-parser');

class ImportService {
  async processCSV(filePath, groupId, userId) {
    const importJob = await prisma.importJob.create({
      data: { 
        groupId, 
        uploadedById: userId, 
        fileUri: filePath, 
        idempotencyKey: Date.now().toString(), 
        fileHash: 'hash-' + Date.now() 
      }
    });

    const VALID_SPLIT_TYPES = ['EQUAL', 'PERCENTAGE', 'SHARE', 'EXACT'];

    return new Promise((resolve, reject) => {
      const results = [];
      const anomalies = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
          let status = 'PENDING';
          const errors = [];

          const [day, month, year] = row.date.split('-');
          const isoDate = `${year}-${month}-${day}`;

          const splitType = VALID_SPLIT_TYPES.includes(row.split_type?.toUpperCase()) 
            ? row.split_type.toUpperCase() 
            : 'EQUAL';

          if (row.currency === 'USD') {
            errors.push('Currency is USD. Provide exchange rate.');
            status = 'AWAITING_USER';
          }
          if (parseFloat(row.amount) < 0) {
            errors.push('Negative amount. Verify refund.');
            status = 'AWAITING_USER';
          }

          if (errors.length > 0) {
            anomalies.push(row);
            await prisma.stagedExpense.create({
              data: { 
                jobId: importJob.id, 
                transactionDate: new Date(isoDate), 
                amount: parseFloat(row.amount), 
                rawCsvRow: row, 
                parsedData: row, 
                errors: errors, 
                status: status 
              }
            });
          } else {
            results.push(row);
            await prisma.expense.create({
              data: { 
                groupId, 
                paidById: userId, 
                description: row.description, 
                amount: parseFloat(row.amount), 
                currency: row.currency, 
                baseCurrencyAmount: parseFloat(row.amount), 
                transactionDate: new Date(isoDate), 
                splitType: splitType 
              }
            });
          }
        })
        .on('end', () => resolve({ jobId: importJob.id, processed: results.length, flagged: anomalies.length }))
        .on('error', reject);
    });
  }
}

module.exports = new ImportService();