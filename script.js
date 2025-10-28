
document.addEventListener('DOMContentLoaded', () => {
    const screens = {
        welcome: document.getElementById('welcome-screen'),
        auth: document.getElementById('auth-screen'),
        admin: document.getElementById('admin-screen'),
    };

    const forms = {
        login: document.getElementById('login-form'),
        signup: document.getElementById('signup-form'),
    };

    const enterBtn = document.getElementById('enter-btn');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    const logoutBtn = document.getElementById('logout-btn');

    const loginForm = document.getElementById('login');
    const signupForm = document.getElementById('signup');

    const userList = document.getElementById('user-list');
    const feedbackMessage = document.getElementById('feedback-message');

    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    let token = null;

    const switchScreen = (screenName) => {
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        screens[screenName].classList.add('active');
    };

    const switchForm = (formName) => {
        Object.values(forms).forEach(form => form.classList.remove('active'));
        forms[formName].classList.add('active');
    };

    const showFeedback = (message, type) => {
        feedbackMessage.textContent = message;
        feedbackMessage.className = type;
        feedbackMessage.style.display = 'block';
        setTimeout(() => {
            feedbackMessage.style.display = 'none';
        }, 3000);
    };

    enterBtn.addEventListener('click', () => switchScreen('auth'));
    showSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchForm('signup');
    });
    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchForm('login');
    });
    logoutBtn.addEventListener('click', () => {
        token = null;
        switchScreen('auth');
    });

    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const passwordInput = btn.previousElementSibling;
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                btn.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                btn.textContent = '👁️';
            }
        });
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        try {
            const res = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await res.json();
            if (res.status === 201) {
                showFeedback(data.message, 'success');
                switchForm('login');
            } else {
                showFeedback(data.message, 'error');
            }
        } catch (error) {
            showFeedback('An error occurred.', 'error');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.status === 200) {
                token = data.user.id; // Simple token for demo
                showFeedback(data.message, 'success');
                switchScreen('admin');
                loadUsers();
            } else {
                showFeedback(data.message, 'error');
            }
        } catch (error) {
            showFeedback('An error occurred.', 'error');
        }
    });

    const loadUsers = async () => {
        if (!token) return;
        try {
            const res = await fetch('/users');
            const users = await res.json();
            userList.innerHTML = '';
            users.forEach(user => {
                const userItem = document.createElement('div');
                userItem.className = 'user-item';
                userItem.innerHTML = `<p><strong>Username:</strong> ${user.username}</p><p><strong>Email:</strong> ${user.email}</p>`;
                userList.appendChild(userItem);
            });
        } catch (error) {
            showFeedback('Failed to load users.', 'error');
        }
    };
});
