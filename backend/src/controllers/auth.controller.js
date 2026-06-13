const authService = require('../services/auth.service');

class AuthController {
  // @desc    Register a new user
  // @route   POST /api/v1/auth/register
  // @access  Public
  async register(req, res, next) {
    try {
      const result = await authService.registerUser(req.body);
      
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Login user & get token
  // @route   POST /api/v1/auth/login
  // @access  Public
  async login(req, res, next) {
    try {
      const result = await authService.loginUser(req.body);
      
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get current logged in user
  // @route   GET /api/v1/auth/me
  // @access  Private
  async getMe(req, res, next) {
    try {
      // req.user is set by the protect middleware
      res.status(200).json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();