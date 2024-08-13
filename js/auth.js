document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username.length < 3) {
                alert('El nombre de usuario debe tener al menos 3 caracteres.');
                return;
            }

            if (password.length < 6) {
                alert('La contraseña debe tener al menos 6 caracteres.');
                return;
            }

            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.find(user => user.username === username)) {
                alert('El nombre de usuario ya existe.');
                return;
            }

            const shaObj = new jsSHA("SHA-256", "TEXT");
            shaObj.update(password);
            const hashedPassword = shaObj.getHash("HEX");

            const newUser = { username, password: hashedPassword };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            window.location.href = '../views/login.html';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username.length < 3 || password.length < 6) {
                alert('Nombre de usuario o contraseña incorrectos.');
                return;
            }

            const shaObj = new jsSHA("SHA-256", "TEXT");
            shaObj.update(password);
            const hashedPassword = shaObj.getHash("HEX");

            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.username === username && user.password === hashedPassword);

            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                alert('Inicio de sesión exitoso.');
                window.location.href = '../index.html';
            } else {
                alert('Nombre de usuario o contraseña incorrectos.');
            }
        });
    }
});
