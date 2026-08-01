document.addEventListener('DOMContentLoaded', () => {
    // Auth Check
    const token = getAdminToken();
    if (!token && !window.location.pathname.endsWith('login.html')) {
        window.location.href = 'login.html';
        return;
    }

    // Logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/index.html';
        });
    }

    // Active link highlight
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
