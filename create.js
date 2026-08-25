const title = document.getElementById('title');
const content = document.getElementById('create_content');
const create_form = document.getElementById('create_form')
const back = document.getElementById('back');

create_form.addEventListener('submit',async (e) => {
    e.preventDefault();

    const titlevalue = title.value.trim();
    const contentvalue = content.value;

    try {
        const access_token = localStorage.getItem('accessToken')

        const response = await fetch('/api/posts', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${access_token}`
            },
            body: JSON.stringify({
                title: titlevalue,
                content: contentvalue
            })  
        });

        if (response.status === 201) {
            alert('작성이 완료되었습니다.')
            create_form.reset();
            location.href = './index.html';
        } else {
            alert('등록을 실패하였습니다.');
        }
    
}catch (error) {
        alert('에러가 발생하였습니다.');
    }
});

back.addEventListener('click', () => {
    location.href = './index.html';
})