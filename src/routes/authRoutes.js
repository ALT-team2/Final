const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * 공개 엔드포인트
 */
// 회원가입
router.post('/signup', authController.signup);

// 로그인
router.post('/login', authController.login);

// Access Token 갱신
router.post('/refresh', authController.refreshToken);

/**
 * 인증 필요 엔드포인트
 */
// 로그아웃
router.post('/logout', authenticate, authController.logout);

// 모든 기기에서 로그아웃
router.post('/logout-all', authenticate, authController.logoutAll);

module.exports = router;