const email = document.getElementById('email');
const ud_password = document.getElementById('ud_password');
const mypage_form = document.getElementById('mypage_form');
const delete_btn = document.getElementById('delete_account');
const goback = document.getElementById('goback');

async function myInfo() {
    try{
        const access_token = localStorage.getItem('accessToken');

        const response = await fetch('/api/users/me', {
            headers : {
                'Authorization' : `Bearer ${access_token}`
            }
        });
        if (response.ok) {
            const me = await response.json();
            email.value = me.email;
        }
    } catch (error) {
        alert('오류가 발생하였습니다.')
    }
}

mypage_form.addEventListener('submit', async(e) =>{
    e.preventDefault();
    const requestBody = {};

    if (email.value.trim() !== '') {
        requestBody.email = email.value;
    };
    if (ud_password.value.trim() !== '') {
        requestBody.password = ud_password.value;
    };

    try {
        const access_token = localStorage.getItem('accessToken');
        
        const response =await fetch('/api/users/me',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(requestBody) 
        });
        if (response.status === 200) {
            alert('수정되었습니다.')
        }
    } catch (error) {
        alert('수정에 실패하였습니다.')
    }
});

delete_btn.addEventListener('click', async ()=> {
    const confirmed = confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
 
    if (!confirmed) {
        return;
    }

    try {
        const access_token = localStorage.getItem('accessToken');

        const response = await fetch('/api/users/me', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        if (response.status === 204) {
            alert('회원탈퇴가 완료되었습니다.')
            localStorage.removeItem('accessToken');
            localStorage.removeItem('myId');
            location.href = './index.html';
        }
    } catch (error) {
        alert('오류가 발생하였습니다.')
    }
});

goback.addEventListener('click', () => {
    location.href = './index.html';
})

myInfo();