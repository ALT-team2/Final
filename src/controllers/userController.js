const userService = require('../services/userService');

/**
 * 현재 사용자 정보 조회
 * GET /api/users/me
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await userService.getCurrentUser(req.userId);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 모든 사용자 조회 (페이지네이션, 검색)
 * GET /api/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const result = await userService.getAllUsers({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 특정 사용자 조회
 * GET /api/users/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 사용자 정보 수정
 * PUT /api/users/:id
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await userService.updateUser(id, updateData);

    res.json({
      success: true,
      message: '사용자 정보가 수정되었습니다',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 현재 사용자 정보 수정
 * PUT /api/users/me
 */
const updateCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const updateData = req.body;

    const user = await userService.updateUser(userId, updateData);

    res.json({
      success: true,
      message: '사용자 정보가 수정되었습니다',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 비밀번호 변경
 * POST /api/users/change-password
 */
const changePassword = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '현재 비밀번호와 새 비밀번호가 필요합니다',
      });
    }

    const result = await userService.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 사용자 삭제 (계정 비활성화)
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);

    res.json({
      success: true,
      message: result.message,
      data: result.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 현재 사용자 삭제 (계정 비활성화)
 * DELETE /api/users/me
 */
const deleteCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const result = await userService.deleteUser(userId);

    res.json({
      success: true,
      message: result.message,
      data: result.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 사용자 계정 복구
 * POST /api/users/:id/restore
 */
const restoreUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.restoreUser(id);

    res.json({
      success: true,
      message: result.message,
      data: result.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateCurrentUser,
  changePassword,
  deleteUser,
  deleteCurrentUser,
  restoreUser,
};