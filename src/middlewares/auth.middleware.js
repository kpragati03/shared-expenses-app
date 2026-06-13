const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verify user still exists and hasn't been soft-deleted
      const user = await prisma.user.findFirst({
        where: {
          id: decoded.id,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          defaultCurrency: true,
        },
      });

      if (!user) {
        const error = new Error('User belonging to this token no longer exists.');
        error.status = 401;
        throw error;
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error.message);
      const err = new Error('Not authorized, token failed');
      err.status = 401;
      next(err);
    }
  }

  if (!token) {
    const error = new Error('Not authorized, no token');
    error.status = 401;
    next(error);
  }
};

module.exports = { protect };