const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, '이메일은 필수입니다'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '유효한 이메일을 입력하세요'],
    },
    password: {
      type: String,
      required: [true, '비밀번호는 필수입니다'],
      minlength: [6, '비밀번호는 최소 6자 이상이어야 합니다'],
      select: false, 
    },
    username: {
      type: String,
      required: [true, '사용자명은 필수입니다'],
      unique: true,
    },
    profile: {
      firstName: String,
      lastName: String,
      phone: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
    refreshTokens: [
      {
        token: String,
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 604800, // 7일 후 자동 삭제
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// 비밀번호 해싱 미들웨어 (저장 전)
userSchema.pre('save', async function (next) {
  // 비밀번호가 수정되지 않았으면 스킵
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(process.env.BCRYPT_ROUNDS || 10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 비밀번호 비교 메서드 설정
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 민감한 정보 제외 메서드
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

module.exports = mongoose.model('User', userSchema);