const importService = require('../services/import.service');
const path = require('path');

class ImportController {
  async upload(req, res, next) {
    try {
      if (!req.file) {
        throw new Error('No file uploaded');
      }

      // req.user humein 'protect' middleware se mil raha hai
      // req.body.groupId mein wo ID bhejenge jo humne abhi banayi thi
      const result = await importService.processCSV(
        req.file.path, 
        req.body.groupId, 
        req.user.id
      );

      res.status(200).json({
        success: true,
        message: 'File processed',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ImportController();