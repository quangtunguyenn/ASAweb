// Dashboard Authentication & User Display
// This script loads user info and handles logout

// Load user information from localStorage
function loadUserInfo() {
    const user = UserManager.getUser();
    
    if (!user) {
        console.log('No user found, redirecting to login...');
        window.location.href = 'login.html';
        return;
    }
    
    console.log('User loaded:', user);
    
    // Update user name in welcome section
    const welcomeName = document.getElementById('welcomeName');
    if (welcomeName) {
        welcomeName.textContent = user.firstName || user.email.split('@')[0];
    }
    
    // Update sidebar user info
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = `${user.firstName} ${user.lastName}`;
    }
    
    const userRole = document.getElementById('userRole');
    if (userRole) {
        userRole.textContent = user.role || 'USER';
    }
    
    // Update user avatar initials
    const userInitials = document.getElementById('userInitials');
    if (userInitials) {
        const initials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
        userInitials.textContent = initials;
    }
}

// Toggle user menu
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.classList.toggle('active');
    }
}

// Toggle sidebar for mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('mobile-open');
    }
}

// Toggle notifications
function toggleNotifications() {
    const notificationPanel = document.getElementById('notificationPanel');
    if (notificationPanel) {
        notificationPanel.classList.toggle('active');
    }
}

// Make functions available globally
window.toggleUserMenu = toggleUserMenu;
window.toggleSidebar = toggleSidebar;
window.toggleNotifications = toggleNotifications;

// Load user info when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!TokenManager.isAuthenticated()) {
        console.log('Not authenticated, redirecting to login...');
        window.location.href = 'login.html';
        return;
    }
    
    // Load user information
    loadUserInfo();
    
    console.log('Dashboard auth initialized');
});
