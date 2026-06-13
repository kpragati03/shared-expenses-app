const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);

module.exports = router;