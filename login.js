const email = document.getElementById('email')
const password = document.getElementById('password')
const error_message = document.getElementById('error_message')
const login_form = document.getElementById('signup');
const login_cancel = document.getElementById('cancel');

login_form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailvalue = email.value.trim();
    const passwordvalue = email.value.trim();

    error_message.style.display = 'none';
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailvalue,
                password: passwordvalue
            })
        });

        if (response.status === 200) {
            const data = await response.json();

            localStorage.setItem('accessToken' ,data.accessToken)

            const meresponse = await fetch('/api/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${data.accessToken}`
                }
            });
            if (meresponse.ok) {
                const me = await meresponse.json();
                localStorage.setItem('myId', me.id);
            }
            login_form.reset();
            location.href = '../login.html'
        } else if (response.status === 400) {
            alert('입력한 정보가 형식에 맞지 않습니다.');
            error_message.style.display = 'block';
        } else if (response.status === 404) {
            alert('존재하지 않는 회원입니다.')
        } else {
            alert('로그인 실패')
        }
    } catch (error) {
        console.error('오류 발생')
        alert('에러가 발생하였습니다.')
    }
})

login_cancel.addEventListener('click', () => {
    location.href = './index.html';
})