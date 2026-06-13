const express = require('express');
const router = express.Router();
const importController = require('../controllers/import.controller');
const upload = require('../middlewares/upload.middleware');
const { protect } = require('../middlewares/auth.middleware');

router.post('/upload', protect, upload.single('file'), importController.upload);

module.exports = router;