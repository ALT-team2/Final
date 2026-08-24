const mongoose = require('mongoose');

// MongoDB 연결

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB 연결 성공: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB 연결 실패: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;