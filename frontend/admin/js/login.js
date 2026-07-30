document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect to dashboard
    if (getAdminToken()) {
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('adminLoginForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = document.getElementById('loginBtn');
            const errorDiv = document.getElementById('loginError');
            
            btn.textContent = 'Logging in...';
            btn.disabled = true;
            errorDiv.textContent = '';

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await api.admin.login(username, password);
                
                if (response && response.access_token) {
                    setAdminToken(response.access_token);
                    window.location.href = 'index.html';
                } else {
                    throw new Error("Invalid response from server");
                }
            } catch (error) {
                console.error('Login error', error);
                errorDiv.textContent = error.detail || 'Invalid credentials. Please try again.';
                btn.textContent = 'Login';
                btn.disabled = false;
            }
        });
    }
});
