const AppError = require('../utils/AppError');

/**
 * 전역 에러 핸들러
 * 모든 에러를 일관된 형식으로 응답
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || '서버 에러가 발생했습니다';

  // 잘못된 MongoDB ID
  if (err.name === 'CastError') {
    const message = `유효하지 않은 ID: ${err.value}`;
    err = new AppError(message, 400);
  }

  // 중복 키 에러 (Mongoose)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field}이(가) 이미 존재합니다`;
    err = new AppError(message, 400);
  }

  // 유효성 검증 에러 (Mongoose)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map(error => error.message)
      .join(', ');
    err = new AppError(message, 400);
  }

  // JWT 에러
  if (err.name === 'JsonWebTokenError') {
    const message = '유효하지 않은 토큰입니다';
    err = new AppError(message, 401);
  }

  // 토큰 만료 에러
  if (err.name === 'TokenExpiredError') {
    const message = '토큰이 만료되었습니다';
    err = new AppError(message, 401);
  }

  // 에러 응답
  res.status(err.statusCode).json({
    success: false,
    statusCode: err.statusCode,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 정의되지 않은 라우트 핸들러
 */
const notFound = (req, res, next) => {
  const error = new AppError(`${req.originalUrl} 경로를 찾을 수 없습니다`, 404);
  next(error);
};

module.exports = {
  globalErrorHandler,
  notFound,
};