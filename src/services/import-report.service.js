const fs = require('fs');
const path = require('path');

class ImportReportService {
  constructor() {
    this.reportPath = path.join(__dirname, '../../import_reports');
    if (!fs.existsSync(this.reportPath)) fs.mkdirSync(this.reportPath);
  }

  generateReport(reportData) {
    const fileName = `import-report-${new Date().getTime()}.json`;
    const fullPath = path.join(this.reportPath, fileName);
    
    const report = {
      timestamp: new Date().toISOString(),
      totalRowsProcessed: reportData.length,
      anomaliesDetected: reportData.filter(r => r.isAnomaly),
      details: reportData
    };

    fs.writeFileSync(fullPath, JSON.stringify(report, null, 2));
    return fileName;
  }
}

module.exports = new ImportReportService();