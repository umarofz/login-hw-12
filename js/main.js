let elPostTemp = document.querySelector("#post__temp").content
let elPostsWrapper = document.querySelector(".posts__list");
let elSavedPosts = document.querySelector(".save__list");
let btnLogout = document.querySelector('.logout__btn');
let resultCounter = document.querySelector(".result__span")
let elForm = document.querySelector(".form")
let elInputTitle = document.querySelector(".input__title")
let elInputBody = document.querySelector(".input__body")
let savedPosts = []


let localToken = localStorage.getItem('token')
fetch("https://fast-ravine-16741.herokuapp.com/api/posts", {
method: 'GET',
headers: {
    "Content-Type":"application/json",
    "Authorization": localToken
}
})
.then(res => res.json())
.then(data => {
    if (!data.error) {
        renderPosts(data.posts, elPostsWrapper)
        resultCounter.innerHTML = data.totalResults
    } else {
        window.location.href = "/login.html"
    }
})

function renderPosts(array, wrapper) {
    wrapper.innerHTML = null;
    let fragment = document.createDocumentFragment();
    
    for (const item of array) {
        let postItem = elPostTemp.cloneNode(true);
        
        postItem.querySelector(".post__item-title").textContent = item.title;
        postItem.querySelector(".post__item-body").textContent = item.body;
        postItem.querySelector(".post__item-delete").dataset.deleteId = item._id;
        postItem.querySelector(".post__item-edit").dataset.editId = item._id;
        postItem.querySelector(".post__item-save").dataset.saveId = item._id;
        
        fragment.appendChild(postItem)
    }
    
    wrapper.appendChild(fragment)
}

btnLogout.addEventListener("click", function() {
    localStorage.removeItem("token")
    
    window.location.href = "/login.html"
})

elPostsWrapper.addEventListener("click", function(evt) {
    let deleteId = evt.target.dataset.deleteId;
    
    if (deleteId) {
        fetch(`https://fast-ravine-16741.herokuapp.com/api/posts/${deleteId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type":"application/json",
            "Authorization": localToken
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        fetch("https://fast-ravine-16741.herokuapp.com/api/posts", {
        method: 'GET',
        headers: {
            "Content-Type":"application/json",
            "Authorization": localToken
        }
    })
    .then(res => res.json())
    .then(data => {
        if (!data.error) {
            renderPosts(data.posts)
            resultCounter.innerHTML = data.totalResults
        } else {
            window.location.href = "/login.html"
        }
    })
})
}
})

elPostsWrapper.addEventListener("click", function(evt) {
    let currentEditID = evt.target.dataset.editId;
    let currenClosest = evt.target.closest(".post__item")
    
    if (currentEditID) {
        elInputTitle.value = currenClosest.querySelector(".post__item-title").textContent
        elInputBody.value = currenClosest.querySelector(".post__item-body").textContent
        
        elForm.addEventListener("submit", function(evt) {
            evt.preventDefault();
            
            let inputTitle = elInputTitle.value.trim();
            let inputBody = elInputBody.value.trim();
            
            fetch(`https://fast-ravine-16741.herokuapp.com/api/posts/${currentEditID}`, {
            method: 'PUT',
            headers: {
                "Content-Type":"application/json",
                "Authorization": localToken
            },
            body: JSON.stringify({
                'title': inputTitle,
                'body': inputBody
            })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.error) {
                currenClosest.querySelector(".post__item-title").textContent = inputTitle
                currenClosest.querySelector(".post__item-body").textContent = inputBody
            }
        })
    })
}
})

elPostsWrapper.addEventListener("click", function(evt) {
    let savedId = evt.target.dataset.saveId;
    let currenClosest = evt.target.closest(".post__item")
    if (savedId) {
        if (savedPosts.length == 0) {
            fetch(`https://fast-ravine-16741.herokuapp.com/api/posts/${savedId}`, 
            {
                method: 'GET',
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": localToken
                }
            })
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    savedPosts.push(data)
                    renderPosts(savedPosts, elSavedPosts)
                }
            })
        } else if (!savedPosts.find(item => item._id == savedId)) {
            fetch(`https://fast-ravine-16741.herokuapp.com/api/posts/${savedId}`, 
            {
                method: 'GET',
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": localToken
                }
            })
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    savedPosts.push(data)
                    renderPosts(savedPosts, elSavedPosts)
                }
            })
        }
    }
})

fetch("https://fast-ravine-16741.herokuapp.com/api/users/me" , {
method: "GET",
headers: {
    'Content-Type': 'application/json',
    "Authorization" : localToken
}
})
.then(data => data.json())
.then(data => {
    if (data.error) {
        window.location.href = "/login.html"
    }else{
        document.querySelector("#username").textContent = data.name
    }
})