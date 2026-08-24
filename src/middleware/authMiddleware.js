const { verifyAccessToken } = require('../utils/tokenUtils');
const AppError = require('../utils/AppError');
const User = require('../models/User');

/**
 * Access Token 검증 미들웨어
 * Authorization 헤더에서 Bearer 토큰을 추출하여 검증
 */
const authenticate = async (req, res, next) => {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token이 필요합니다', 401);
    }

    const token = authHeader.substring(7); // Bearer 제거

    // 토큰 검증
    const decoded = verifyAccessToken(token);

    // 사용자 정보 조회
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new AppError('사용자를 찾을 수 없거나 비활성 상태입니다', 401);
    }

    // req 객체에 사용자 정보 추가
    req.user = user;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    next(error);
  }
};

//토큰이 있으면 검증, 없어도 진행
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId);
      if (user && user.isActive) {
        req.user = user;
        req.userId = decoded.userId;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth,
};