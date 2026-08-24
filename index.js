require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { globalErrorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// 데이터베이스 연결
connectDB();

//JSON 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

//API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

//정의되지 않은 라우트

app.use(notFound);

//에러 핸들러
app.use(globalErrorHandler);

//시작
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
});


//에러 처리
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
});
