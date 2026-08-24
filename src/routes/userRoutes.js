const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * 모든 사용자 라우트는 인증 필수
 */
router.use(authenticate);

/**
 * 현재 사용자 관련
 */
// 현재 사용자 정보 조회
router.get('/me', userController.getCurrentUser);

// 현재 사용자 정보 수정
router.put('/me', userController.updateCurrentUser);

// 현재 사용자 삭제
router.delete('/me', userController.deleteCurrentUser);

// 비밀번호 변경
router.post('/change-password', userController.changePassword);

/**
 * 모든 사용자 관리 (관리자용)
 */
// 모든 사용자 조회 (페이지네이션, 검색)
router.get('/', userController.getAllUsers);

// 특정 사용자 조회
router.get('/:id', userController.getUserById);

// 특정 사용자 정보 수정
router.put('/:id', userController.updateUser);

// 특정 사용자 삭제
router.delete('/:id', userController.deleteUser);

// 특정 사용자 계정 복구
router.post('/:id/restore', userController.restoreUser);

module.exports = router;