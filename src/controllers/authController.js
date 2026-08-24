const authService = require('../services/authService');

/**
 * 회원가입
 * POST /api/auth/signup
 */
const signup = async (req, res, next) => {
  try {
    const { email, password, username, firstName, lastName } = req.body;

    const result = await authService.signup({
      email,
      password,
      username,
      firstName,
      lastName,
    });

    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 로그인
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    // Refresh Token을 httpOnly 쿠키에 저장 (선택사항)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    res.json({
      success: true,
      message: '로그인이 완료되었습니다',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh Token으로 새 Access Token 발급
 * POST /api/auth/refresh
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token이 필요합니다',
      });
    }

    const newTokens = await authService.refreshAccessToken(token);

    // 새 Refresh Token을 쿠키에 저장
    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Access token이 갱신되었습니다',
      data: newTokens,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 로그아웃
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.userId;

    await authService.logout(userId, refreshToken);

    // 쿠키에서 토큰 제거
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: '로그아웃되었습니다',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 모든 기기에서 로그아웃
 * POST /api/auth/logout-all
 */
const logoutAll = async (req, res, next) => {
  try {
    const userId = req.userId;

    await authService.logoutAll(userId);

    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: '모든 기기에서 로그아웃되었습니다',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  refreshToken,
  logout,
  logoutAll,
};