document.addEventListener("DOMContentLoaded", function() {
    const authTokenRow = document.cookie.split('; ').find(row => row.startsWith('Authtoken'));
    const authToken = authTokenRow ? authTokenRow.split('=')[1] : null;

    if (authToken) {
        // User is logged in. Hide login/register forms and show the welcome message.
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'block';
        document.getElementById('message').textContent = `Welcome back!`;
    } else {
        // User is not logged in. Show login/register forms.
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'none';
    }
});

function login() {
    const data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').textContent = data.message;
        if (data.success) {
            setCookie('authToken', data.token, 1);
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('logoutButton').style.display = 'block';
        }
    });
}

function register() {
    const data = {
        username: document.getElementById('regUsername').value,
        password: document.getElementById('regPassword').value
    };

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(message => {
        document.getElementById('message').textContent = message;
    });
}

function logout() {
    setCookie('authToken', '', -1);
    location.reload();
}

function toggleAuth(showForm, hideForm) {
    document.getElementById(showForm).style.display = 'block';
    document.getElementById(hideForm).style.display = 'none';
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
