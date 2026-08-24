const User = require('../models/User');
const AppError = require('../utils/AppError');

/**
 * 모든 사용자 조회 (관리자용)
 */
const getAllUsers = async (options = {}) => {
  const { page = 1, limit = 10, search = '' } = options;
  const skip = (page - 1) * limit;

  const query = {};
  if (search) {
    query.$or = [
      { email: new RegExp(search, 'i') },
      { username: new RegExp(search, 'i') },
      { 'profile.firstName': new RegExp(search, 'i') },
      { 'profile.lastName': new RegExp(search, 'i') },
    ];
  }

  const users = await User.find(query)
    .select('-password -refreshTokens')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * 사용자 ID로 조회
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password -refreshTokens');
  if (!user) {
    throw new AppError('사용자를 찾을 수 없습니다', 404);
  }
  return user;
};

/**
 * 사용자 정보 수정
 */
const updateUser = async (userId, updateData) => {
  // 수정 불가능한 필드 제거
  const { password, refreshTokens, createdAt, updatedAt, ...allowedData } =
    updateData;

  const user = await User.findByIdAndUpdate(
    userId,
    allowedData,
    {
      new: true,
      runValidators: true,
    }
  ).select('-password -refreshTokens');

  if (!user) {
    throw new AppError('사용자를 찾을 수 없습니다', 404);
  }

  return user;
};

/**
 * 비밀번호 변경
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  // 사용자 조회 (password 필드 포함)
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new AppError('사용자를 찾을 수 없습니다', 404);
  }

  // 현재 비밀번호 확인
  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('현재 비밀번호가 올바르지 않습니다', 401);
  }

  // 새 비밀번호 설정
  user.password = newPassword;
  await user.save();

  return { message: '비밀번호가 변경되었습니다' };
};

/**
 * 사용자 삭제 (소프트 삭제 - 비활성화)
 */
const deleteUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true }
  ).select('-password -refreshTokens');

  if (!user) {
    throw new AppError('사용자를 찾을 수 없습니다', 404);
  }

  return { message: '사용자 계정이 삭제되었습니다', user };
};

/**
 * 사용자 계정 복구 (비활성화된 계정 활성화)
 */
const restoreUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: true },
    { new: true }
  ).select('-password -refreshTokens');

  if (!user) {
    throw new AppError('사용자를 찾을 수 없습니다', 404);
  }

  return { message: '사용자 계정이 복구되었습니다', user };
};

/**
 * 현재 사용자 정보 조회
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select('-password -refreshTokens');
  if (!user) {
    throw new AppError('사용자를 찾을 수 없습니다', 404);
  }
  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  changePassword,
  deleteUser,
  restoreUser,
  getCurrentUser,
};