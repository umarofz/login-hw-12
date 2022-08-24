let elForm = document.querySelector(".form")
let elEmailInput = document.querySelector(".input__email")
let elPasswordInput = document.querySelector(".input__password")

elForm.addEventListener("submit", function(evt) {
    evt.preventDefault();

    let emailInput = elEmailInput.value.trim();
    let passwordInput = elPasswordInput.value.trim();

    fetch("https://fast-ravine-16741.herokuapp.com/api/auth", {
        method: 'POST',
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            'email': emailInput,
            'password': passwordInput
        })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.error) {
            localStorage.setItem("token", data.Authorization)
            window.location.href = "/index.html"
        } else {
            alert(data.error)
        }
    })
})