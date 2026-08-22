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