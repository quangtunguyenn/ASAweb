/* ============================================
   DASHBOARD FUNCTIONALITY
   ============================================ */

// Check authentication
if (!window.AuthModule || !window.AuthModule.TokenManager.isAuthenticated()) {
    window.location.href = 'login.html';
}

// Get user info
const currentUser = window.AuthModule.UserManager.getUser();

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 1024) {
        sidebar.classList.toggle('collapsed');
    } else {
        sidebar.classList.toggle('show');
    }
}

// Toggle user menu
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    const userBtn = document.querySelector('.user-btn');
    
    dropdown.classList.toggle('show');
    userBtn.classList.toggle('active');
    
    // Close when clicking outside
    document.addEventListener('click', function closeDropdown(e) {
        if (!userBtn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
            userBtn.classList.remove('active');
            document.removeEventListener('click', closeDropdown);
        }
    });
}

// Toggle notifications
function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    panel.classList.toggle('show');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.AuthModule.logout();
    }
}

// Load user data
function loadUserData() {
    if (currentUser) {
        // Update user name displays
        const userName = document.getElementById('userName');
        const welcomeUserName = document.getElementById('welcomeUserName');
        const userInitials = document.getElementById('userInitials');
        
        const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
        
        if (userName) userName.textContent = fullName;
        if (welcomeUserName) welcomeUserName.textContent = currentUser.firstName;
        if (userInitials) {
            userInitials.textContent = (currentUser.firstName[0] + currentUser.lastName[0]).toUpperCase();
        }
    }
}

// Load dashboard statistics
async function loadStatistics() {
    try {
        // Load file statistics
        const filesResponse = await window.AuthModule.authenticatedFetch('/files/stats');
        if (filesResponse.ok) {
            const fileStats = await filesResponse.json();
            document.getElementById('statDocuments').textContent = fileStats.totalFiles || 0;
        }
        
        // Mock data for other stats (replace with real API calls)
        document.getElementById('statHours').textContent = '24';
        document.getElementById('statTasks').textContent = '12';
        document.getElementById('statGoals').textContent = '5';
        
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Load recent activity
async function loadRecentActivity() {
    try {
        const response = await window.AuthModule.authenticatedFetch('/activity/recent?limit=5');
        if (response.ok) {
            const activities = await response.json();
            displayActivities(activities);
        }
    } catch (error) {
        console.error('Error loading recent activity:', error);
        // Keep the default placeholder activities
    }
}

function displayActivities(activities) {
    const activityList = document.getElementById('activityList');
    if (!activityList || activities.length === 0) return;
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${getActivityIcon(activity.type)}</div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${formatTimeAgo(activity.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

function getActivityIcon(type) {
    const icons = {
        'upload': '📚',
        'chat': '💬',
        'task': '✅',
        'study': '📝',
        'exam': '📋'
    };
    return icons[type] || '📌';
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
}

// Simple chart rendering (replace with Chart.js or similar for production)
function renderStudyChart() {
    const canvas = document.getElementById('studyChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Sample data (replace with real data from API)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const studyHours = [3, 5, 4, 6, 5, 7, 4];
    const targetHours = [5, 5, 5, 5, 5, 5, 5];
    
    const barWidth = 60;
    const barGap = 40;
    const startX = 100;
    const maxValue = Math.max(...studyHours, ...targetHours);
    const scale = (height - 100) / maxValue;
    
    // Draw axes
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX - 20, 50);
    ctx.lineTo(startX - 20, height - 50);
    ctx.lineTo(width - 50, height - 50);
    ctx.stroke();
    
    // Draw bars
    days.forEach((day, index) => {
        const x = startX + index * (barWidth + barGap);
        const barHeight = studyHours[index] * scale;
        const y = height - 50 - barHeight;
        
        // Study hours bar (gradient)
        const gradient = ctx.createLinearGradient(0, y, 0, height - 50);
        gradient.addColorStop(0, '#6366F1');
        gradient.addColorStop(1, '#8B5CF6');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Target line
        const targetY = height - 50 - (targetHours[index] * scale);
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x, targetY);
        ctx.lineTo(x + barWidth, targetY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Day label
        ctx.fillStyle = '#6B7280';
        ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(day, x + barWidth / 2, height - 25);
        
        // Value label
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText(studyHours[index] + 'h', x + barWidth / 2, y - 10);
    });
}

// Handle responsive sidebar
function handleResize() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 1024) {
        sidebar.classList.remove('show');
    }
}

// Task checkbox handler
function handleTaskCheckbox() {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function(e) {
            const taskItem = e.target.closest('.task-item');
            if (e.target.checked) {
                taskItem.style.opacity = '0.6';
                taskItem.style.textDecoration = 'line-through';
                
                // Show success message
                window.AuthModule.showMessage('Task completed! Great job! 🎉', 'success');
                
                // Update stats
                setTimeout(() => {
                    const statTasks = document.getElementById('statTasks');
                    const currentValue = parseInt(statTasks.textContent);
                    statTasks.textContent = currentValue + 1;
                }, 300);
            } else {
                taskItem.style.opacity = '1';
                taskItem.style.textDecoration = 'none';
            }
        });
    });
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard initialized');
    
    // Load user data
    loadUserData();
    
    // Load dashboard data
    loadStatistics();
    loadRecentActivity();
    
    // Render chart
    renderStudyChart();
    
    // Setup task checkboxes
    handleTaskCheckbox();
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        // Close user menu if clicking outside
        const userMenu = document.querySelector('.user-menu');
        const userDropdown = document.getElementById('userDropdown');
        if (userMenu && !userMenu.contains(e.target)) {
            userDropdown.classList.remove('show');
            document.querySelector('.user-btn').classList.remove('active');
        }
        
        // Close notifications if clicking outside
        const notificationBtn = document.querySelector('.notification-btn');
        const notificationPanel = document.getElementById('notificationPanel');
        if (notificationPanel && !notificationPanel.contains(e.target) && 
            notificationBtn && !notificationBtn.contains(e.target)) {
            notificationPanel.classList.remove('show');
        }
    });
    
    // Auto-refresh statistics every 30 seconds
    setInterval(loadStatistics, 30000);
    
    console.log('Dashboard ready! 🚀');
});

// Export functions for global use
window.DashboardModule = {
    toggleSidebar,
    toggleUserMenu,
    toggleNotifications,
    logout,
    loadStatistics,
    loadRecentActivity
};
