// Modern Dashboard JavaScript
import { fetchWithAuth, logout } from './auth.js';

// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.querySelector('.sidebar');
const userProfile = document.querySelector('.user-profile');
const userMenu = document.querySelector('.user-menu');
const notificationBtn = document.getElementById('notificationBtn');
const notificationPanel = document.getElementById('notificationPanel');
const closeNotificationBtn = document.getElementById('closeNotification');
const studyProgressChart = document.getElementById('studyProgressChart');

// Mobile Menu Toggle
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// User Menu Toggle
if (userProfile && userMenu) {
    userProfile.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', () => {
        userMenu.classList.remove('active');
    });
}

// Notification Panel Toggle
if (notificationBtn && notificationPanel) {
    notificationBtn.addEventListener('click', () => {
        notificationPanel.classList.toggle('active');
    });
    
    if (closeNotificationBtn) {
        closeNotificationBtn.addEventListener('click', () => {
            notificationPanel.classList.remove('active');
        });
    }
}

// Logout Functionality
const logoutBtns = document.querySelectorAll('[data-action="logout"]');
logoutBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        await logout();
    });
});

// Load User Data
async function loadUserData() {
    try {
        const userData = await fetchWithAuth('/api/auth/me');
        if (userData) {
            updateUserDisplay(userData);
        }
    } catch (error) {
        console.error('Failed to load user data:', error);
    }
}

// Update User Display
function updateUserDisplay(userData) {
    const userName = document.querySelector('.user-name');
    const userEmail = document.querySelector('.user-email');
    const welcomeTitle = document.querySelector('.welcome-title');
    const userAvatar = document.querySelector('.user-avatar');
    
    if (userName) userName.textContent = userData.name || userData.username;
    if (userEmail) userEmail.textContent = userData.email;
    if (welcomeTitle) {
        const name = userData.name ? userData.name.split(' ')[0] : userData.username;
        welcomeTitle.innerHTML = `Welcome back, <span class="gradient-text">${name}</span> 👋`;
    }
    if (userAvatar) {
        const initials = userData.name 
            ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : userData.username.slice(0, 2).toUpperCase();
        userAvatar.textContent = initials;
    }
}

// Load Statistics
async function loadStatistics() {
    try {
        // TODO: Replace with actual API calls when backend endpoints are ready
        const stats = {
            documents: 24,
            studyHours: 36.5,
            tasksDone: 18,
            tasksTotal: 24,
            performance: 92
        };
        
        updateStatistics(stats);
        animateCounters();
    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

// Update Statistics
function updateStatistics(stats) {
    const statValues = {
        documents: document.querySelector('.stat-card.purple .stat-value'),
        studyHours: document.querySelector('.stat-card.blue .stat-value'),
        tasks: document.querySelector('.stat-card.green .stat-value'),
        performance: document.querySelector('.stat-card.orange .stat-value')
    };
    
    if (statValues.documents) statValues.documents.textContent = stats.documents;
    if (statValues.studyHours) statValues.studyHours.textContent = stats.studyHours;
    if (statValues.tasks) statValues.tasks.textContent = `${stats.tasksDone}/${stats.tasksTotal}`;
    if (statValues.performance) statValues.performance.textContent = `${stats.performance}%`;
}

// Animate Counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.textContent.replace(/[^\d.]/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                const text = counter.textContent;
                const hasPercent = text.includes('%');
                const hasSlash = text.includes('/');
                
                if (hasPercent) {
                    counter.textContent = `${Math.floor(current)}%`;
                } else if (hasSlash) {
                    const total = text.split('/')[1];
                    counter.textContent = `${Math.floor(current)}/${total}`;
                } else if (text.includes('.')) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.floor(current);
                }
                
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = counter.textContent.replace(/[\d.]+/, target);
            }
        };
        
        updateCounter();
    });
}

// Study Progress Chart
function initializeChart() {
    if (!studyProgressChart) return;
    
    const ctx = studyProgressChart.getContext('2d');
    const width = studyProgressChart.width;
    const height = studyProgressChart.height;
    
    // Sample data - TODO: Replace with actual data from backend
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [4, 5.5, 3, 6, 4.5, 7, 5]
    };
    
    drawChart(ctx, width, height, data);
}

// Draw Chart
function drawChart(ctx, width, height, data) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.labels.length;
    const maxValue = Math.max(...data.values);
    
    // Set colors
    const primaryColor = '#6366F1';
    const purpleColor = '#8B5CF6';
    
    // Draw bars
    data.values.forEach((value, index) => {
        const x = padding + index * barWidth + barWidth * 0.2;
        const barHeight = (value / maxValue) * chartHeight;
        const y = height - padding - barHeight;
        const barActualWidth = barWidth * 0.6;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(1, purpleColor);
        
        // Draw bar
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barActualWidth, barHeight, [8, 8, 0, 0]);
        ctx.fill();
        
        // Draw label
        ctx.fillStyle = '#6B7280';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(data.labels[index], x + barActualWidth / 2, height - padding + 20);
        
        // Draw value
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 12px Inter';
        ctx.fillText(`${value}h`, x + barActualWidth / 2, y - 10);
    });
    
    // Draw y-axis labels
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '11px Inter';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 4; i++) {
        const value = (maxValue / 4) * i;
        const y = height - padding - (chartHeight / 4) * i;
        ctx.fillText(`${value.toFixed(1)}h`, padding - 10, y + 4);
        
        // Draw grid line
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
}

// Add roundRect polyfill for older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radii) {
        if (!Array.isArray(radii)) {
            radii = [radii, radii, radii, radii];
        }
        
        this.moveTo(x + radii[0], y);
        this.lineTo(x + width - radii[1], y);
        this.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
        this.lineTo(x + width, y + height - radii[2]);
        this.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
        this.lineTo(x + radii[3], y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
        this.lineTo(x, y + radii[0]);
        this.quadraticCurveTo(x, y, x + radii[0], y);
        this.closePath();
    };
}

// Task Checkbox Handlers
function initializeTaskHandlers() {
    const taskCheckboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', async (e) => {
            const taskItem = e.target.closest('.task-item');
            const taskTitle = taskItem.querySelector('.task-title');
            
            if (e.target.checked) {
                taskTitle.style.textDecoration = 'line-through';
                taskTitle.style.opacity = '0.6';
                
                // TODO: Send update to backend
                console.log('Task completed:', taskTitle.textContent);
                
                // Show success message
                showToast('Task completed! 🎉', 'success');
            } else {
                taskTitle.style.textDecoration = 'none';
                taskTitle.style.opacity = '1';
            }
        });
    });
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10B981' : '#6366F1'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        font-weight: 600;
        z-index: 1000;
        animation: slideInUp 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Time Filter Handler
const timeFilter = document.querySelector('.time-filter');
if (timeFilter) {
    timeFilter.addEventListener('change', (e) => {
        console.log('Time filter changed:', e.target.value);
        // TODO: Reload chart data based on selected time period
        initializeChart();
    });
}

// Quick Action Button Handlers
const uploadFilesBtn = document.querySelector('[data-action="upload"]');
const startChatBtn = document.querySelector('[data-action="chat"]');

if (uploadFilesBtn) {
    uploadFilesBtn.addEventListener('click', () => {
        window.location.href = '/frontend/pages/file-upload.html';
    });
}

if (startChatBtn) {
    startChatBtn.addEventListener('click', () => {
        window.location.href = '/frontend/pages/ai-chat.html';
    });
}

// Search Functionality
const searchInput = document.querySelector('.header-search input');
if (searchInput) {
    // Add keyboard shortcut (Cmd+K or Ctrl+K)
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        // TODO: Implement search functionality
        console.log('Search query:', query);
    });
}

// Notification Click Handlers
const notificationItems = document.querySelectorAll('.notification-item');
notificationItems.forEach(item => {
    item.addEventListener('click', () => {
        item.classList.remove('unread');
        
        // Update notification badge
        const badge = notificationBtn?.querySelector('.notification-badge');
        if (badge) {
            const count = parseInt(badge.textContent) - 1;
            if (count > 0) {
                badge.textContent = count;
            } else {
                badge.remove();
            }
        }
        
        // TODO: Navigate to relevant page or show detail
        console.log('Notification clicked:', item.querySelector('.notification-title').textContent);
    });
});

// Activity Item Click Handlers
const activityItems = document.querySelectorAll('.activity-item');
activityItems.forEach(item => {
    item.addEventListener('click', () => {
        const title = item.querySelector('.activity-title').textContent;
        console.log('Activity clicked:', title);
        // TODO: Navigate to relevant page
    });
});

// Coach Card Actions
const askCoachBtn = document.querySelector('[data-action="ask-coach"]');
const dismissCoachBtn = document.querySelector('[data-action="dismiss-coach"]');

if (askCoachBtn) {
    askCoachBtn.addEventListener('click', () => {
        window.location.href = '/frontend/pages/study-coach.html';
    });
}

if (dismissCoachBtn) {
    dismissCoachBtn.addEventListener('click', () => {
        const coachCard = document.querySelector('.coach-card');
        if (coachCard) {
            coachCard.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => coachCard.remove(), 300);
        }
    });
}

// Resize Chart on Window Resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (studyProgressChart) {
            studyProgressChart.width = studyProgressChart.parentElement.offsetWidth;
            initializeChart();
        }
    }, 250);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }
`;
document.head.appendChild(style);

// Initialize Dashboard
async function initializeDashboard() {
    console.log('Initializing modern dashboard...');
    
    // Load user data
    await loadUserData();
    
    // Load statistics
    await loadStatistics();
    
    // Initialize chart
    if (studyProgressChart) {
        studyProgressChart.width = studyProgressChart.parentElement.offsetWidth;
        studyProgressChart.height = 300;
        initializeChart();
    }
    
    // Initialize task handlers
    initializeTaskHandlers();
    
    console.log('Dashboard initialized successfully!');
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
    initializeDashboard();
}

// Export functions for external use
export {
    loadUserData,
    loadStatistics,
    initializeChart,
    showToast
};
