<<<<<<< HEAD
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
=======
const all_list = document.getElementById('all_list');
const write = document.getElementById('write');
const profile = document.getElementById('profile');

async function allPost() {
    try {
        const response = await fetch('/api/posts');

        if (!response.ok) {
            all_list.innerHTML = '<li>게시물을 불러오지 못하였습니다.</li>';
            return;
        }
        const data = await response.json()

        all_list.innerHTML = '';

        if (data.content.length === 0){
            all_list.innerHTML = '<li>등록된 게시물이 없습니다.</li>';
            return;
        }
        data.content.forEach(post => {
            const li = document.createElement('li');

            li.innerHTML = `<a href="./details.html?id=${post.id}"><b>${post.title}</b><p>${post.content.slice(0,25)}</p><span>${post.authorEmail}</span><p>${createdAt}</p></a>`;
            all_list.append(li);
        });
        
    } catch (error){
        postList.innerHTML = '<li>오류가 발생했습니다.</li>';
    }
};

write.addEventListener('click', (e)=> {
    const access_token = localStorage.getItem('accessToken');

    if (!access_token) {
        e.preventDefault();
        alert("로그인을 해주세요");
    }
    
});

profile.addEventListener('click', (e)=> {
    const access_token = localStorage.getItem('accessToken');

    if (!access_token) {
        e.preventDefault();
        alert("로그인을 해주세요");
    }
    
});

allPost();
>>>>>>> other/feature/main-page
