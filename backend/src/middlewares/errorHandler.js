const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const environment = process.env.NODE_ENV || 'development';

  const errorResponse = {
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(environment === 'development' && { stack: err.stack }),
    },
  };

  // Handle specific Prisma errors (can be expanded later)
  if (err.code && err.code.startsWith('P')) {
    errorResponse.error.message = 'Database Error';
    if (environment === 'development') {
      errorResponse.error.prismaCode = err.code;
      errorResponse.error.meta = err.meta;
    }
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;