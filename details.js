const title = document.getElementById('head');
const content = document.getElementById('content');
const back = document.getElementById('back');
const delete_btn = document.getElementById('delete');
const update = document.getElementById('update')

const params = new URLSearchParams(location.search);
const postId = params.get('id');

delete_btn.style.display = 'none';
update.style.display = 'none';

async function LoadDetails() {
    try {
        const response = await fetch(`/api/posts/${postId}`);

        if (!response.ok) {
            title.textContent = '게시물을 불러오지 못했습니다.';
            return;
        }

        const data = await response.json();

        title.textContent = data.title;
        content.textContent = data.content;

        const myEmail = localStorage.getItem('myEmail');

        if (myEmail && myEmail === data.authorEmail) {
            delete_btn.style.display = 'inline-block';
            update.style.display = 'inline-block';
        } else {
            delete_btn.style.display = 'none';
            update.style.display = 'none';
        }
    } catch (error) {
        alert('게시물을 불러오는데 오류가 발생하였습니다.');
    }
};

LoadDetails();

back.addEventListener('click', () => {
    location.href = './index.html';
})

delete_btn.addEventListener('click', async () => {
    const confirmed = confirm('삭제하시겠습니까?');
    if (!   confirmed) return;

    try {
        const access_token = localStorage.getItem('accessToken');

        const response = await fetch(`/api/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        if (response.status === 204) {
            alert('삭제되었습니다.');
            location.href = './index.html';
        } else if (response.status === 403) {
            alert('본인이 작성한 글이 아닙니다.')
        }
    }catch (error) {
            alert('오류가 발생하였습니다.');
        }
});

update.addEventListener('click', () => {
    location.href = `./update.html?id=${post.id}`;
})