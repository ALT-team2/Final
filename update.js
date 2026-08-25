const title = document.getElementById('update_title');
const content = document.getElementById('update_content')
const update_form = document.getElementById('update_form');
const back = document.getElementById('back');

const params = new URLSearchParams(location.search);
const postId = params.get('id');

async function Load() {
    try {
        const response = await fetch(`/api/posts/${postId}`);

        if (!response.ok) {
            title.value = '게시물을 불러오지 못했습니다.';
            return;
        }

        const data = await response.json();

        title.value = data.title;
        content.value = data.content;

    } catch (error) {
        alert('게시물을 불러오는데 오류가 발생하였습니다.');
    }
};

update_form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const access_token = localStorage.getItem('accessToken');

        const response = await fetch(`/api/posts/${postId}`, {
            method : 'PUT',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body : JSON.stringify({
                title : title.value,
                content : content.value
            })
        });

        if (response.status === 200) {
            alert('수정되었습니다.');
            location.href = `./detail.html?id=${postId}`;
        } else if (response.status === 403) {
            alert('자신의 글이 아닙니다.')
        }
    } catch (error) {
        alert('오류가 발생하였습니다.');    
    }
})

back.addEventListener('click', () => {
    location.href = './index.html';
})

Load()