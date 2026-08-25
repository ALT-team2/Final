const email = document.getElementById('email');
const password = document.getElementById('password');
const password_check = document.getElementById('password_check');
const error_message = document.getElementById('error_message');
const signup_form = document.getElementById('signup');
const cancel = document.getElementById('cancel');

signup_form.addEventListener('submit',async (e) => {
    e.preventDefault();

    const emailvalue = email.value.trim();
    const passwordvalue = password.value.trim();
    const password_checkvalue = password_check.value.trim();

    if (!passwordvalue || passwordvalue !== password_checkvalue) {
        error_message.style.display = 'block';
        return;
    }
    error_message.style.display ='none';
    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailvalue,
                password: passwordvalue
            })  
        });

        if (response.status === 201) {
            alert('회원가입이 완료되었습니다.')
            signup_form.reset();
            location.href = '../login.html';
        } else if (response.status === 400) {
            alert('입력한 정보가 형식에 맞지 않습니다.');
        } else if (response.status === 409) {
            alert('이미 가입된 이메일입니다.');
        } else {
            alert('회원가입 실패');
        }
    
}catch (error) {
        alert('에러가 발생하였습니다.');
    }
});

cancel.addEventListener('click', () => {
    location.href = './index.html';
})