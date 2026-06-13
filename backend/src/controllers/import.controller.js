const importService = require('../services/import.service');
const path = require('path');

class ImportController {
  /**
   * Handle CSV file upload and processing
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async upload(req, res, next) {
    try {
      // Validate if file exists in the request
      if (!req.file) {
        throw new Error('No file uploaded');
      }

      // Process the CSV file via ImportService
      // groupId and user context are extracted from the request
      const result = await importService.processCSV(
        req.file.path, 
        req.body.groupId, 
        req.user.id
      );

      res.status(200).json({
        success: true,
        message: 'CSV file processed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ImportController();