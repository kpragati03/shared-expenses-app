const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const groupRoutes = require('./group.routes');
const importRoutes = require('./import.routes');

// Health Check Endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes Registration
router.use('/auth', authRoutes);
router.use('/groups', groupRoutes);
router.use('/import', importRoutes);

module.exports = router;