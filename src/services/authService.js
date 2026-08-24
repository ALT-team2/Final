const User = require('../models/User');
const AppError = require('../utils/AppError');
const { generateTokenPair, verifyRefreshToken } = require('../utils/tokenUtils');

/**
 * 회원가입
 */
const signup = async ({ email, password, username, firstName, lastName }) => {
  // 이미 존재하는 사용자 확인
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new AppError('이미 가입된 이메일 또는 사용자명입니다', 400);
  }

  // 새 사용자 생성
  const user = new User({
    email,
    password,
    username,
    profile: {
      firstName,
      lastName,
    },
  });

  await user.save();

  // 토큰 쌍 생성
  const tokens = generateTokenPair(user._id);

  // Refresh Token 저장
  user.refreshTokens.push({ token: tokens.refreshToken });
  await user.save();

  return {
    user: user.toJSON(),
    ...tokens,
  };
};

/**
 * 로그인 (이메일/비밀번호)
 */
const login = async ({ email, password }) => {
  // 사용자 조회 (password 필드 포함)
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('이메일 또는 비밀번호가 올바르지 않습니다', 401);
  }

  if (!user.isActive) {
    throw new AppError('비활성 계정입니다', 403);
  }

  // 토큰 쌍 생성
  const tokens = generateTokenPair(user._id);

  // Refresh Token 저장
  user.refreshTokens.push({ token: tokens.refreshToken });
  user.lastLogin = new Date();
  await user.save();

  return {
    user: user.toJSON(),
    ...tokens,
  };
};

/**
 * Refresh Token으로 새 Access Token 발급
 */
const refreshAccessToken = async (refreshToken) => {
  // Refresh Token 검증
  const decoded = verifyRefreshToken(refreshToken);

  // 사용자 조회
  const user = await User.findById(decoded.userId);
  if (!user || !user.isActive) {
    throw new AppError('사용자를 찾을 수 없습니다', 401);
  }

  // Refresh Token이 데이터베이스에 존재하는지 확인
  const tokenExists = user.refreshTokens.some(
    (rt) => rt.token === refreshToken
  );
  if (!tokenExists) {
    throw new AppError('유효하지 않은 Refresh token입니다', 401);
  }

  // 새 토큰 쌍 생성
  const newTokens = generateTokenPair(user._id);

  // 기존 Refresh Token 제거 및 새 토큰 추가
  user.refreshTokens = user.refreshTokens.filter(
    (rt) => rt.token !== refreshToken
  );
  user.refreshTokens.push({ token: newTokens.refreshToken });
  await user.save();

  return newTokens;
};

/**
 * 로그아웃
 */
const logout = async (userId, refreshToken) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('사용자를 찾을 수 없습니다', 404);
  }

  // Refresh Token 제거
  user.refreshTokens = user.refreshTokens.filter(
    (rt) => rt.token !== refreshToken
  );
  await user.save();

  return { message: '로그아웃되었습니다' };
};

/**
 * 모든 기기에서 로그아웃
 */
const logoutAll = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('사용자를 찾을 수 없습니다', 404);
  }

  // 모든 Refresh Token 제거
  user.refreshTokens = [];
  await user.save();

  return { message: '모든 기기에서 로그아웃되었습니다' };
};

module.exports = {
  signup,
  login,
  refreshAccessToken,
  logout,
  logoutAll,
};