let elForm = document.querySelector(".form")
let elNameInput = document.querySelector(".input__name")
let elEmailInput = document.querySelector(".input__email")
let elPasswordInput = document.querySelector(".input__password")


elForm.addEventListener("submit", function(evt) {
    evt.preventDefault()
    
    let nameInput = elNameInput.value.trim()
    let emailInput = elEmailInput.value.trim()
    let passwordInput = elPasswordInput.value.trim()
    
    fetch("https://fast-ravine-16741.herokuapp.com/api/auth", {
    method:'POST',
    headers: {
        "Content-Type":"application/json"
    },
    body: JSON.stringify({
        "name": nameInput,
        "email": emailInput,
        "password": passwordInput,
        "isAdmin": true
    })
})
.then(res => res.json())
.then(data => {
    if (!data.error) {
        window.location.href = "/login.html"
    } else {
        alert(data.error)
    }
})
})