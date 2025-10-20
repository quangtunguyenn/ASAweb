/* ============================================
   AUTHENTICATION & USER MANAGEMENT
   ============================================ */

const API_BASE_URL = 'http://localhost:8080/api';

// Token Management
const TokenManager = {
    setToken(token) {
        localStorage.setItem('authToken', token);
    },
    
    getToken() {
        return localStorage.getItem('authToken');
    },
    
    removeToken() {
        localStorage.removeItem('authToken');
    },
    
    isAuthenticated() {
        return !!this.getToken();
    }
};

// User Management
const UserManager = {
    setUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },
    
    getUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },
    
    removeUser() {
        localStorage.removeItem('currentUser');
    },
    
    updateUser(updates) {
        const user = this.getUser();
        if (user) {
            const updatedUser = { ...user, ...updates };
            this.setUser(updatedUser);
        }
    }
};

// Show message to user
function showMessage(message, type = 'info') {
    const messageEl = document.getElementById('authMessage');
    if (!messageEl) return;
    
    messageEl.textContent = message;
    messageEl.className = `auth-message ${type}`;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// Toggle password visibility
function togglePassword(inputId = 'password') {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// Check password strength
function checkPasswordStrength(password) {
    const strengthEl = document.getElementById('passwordStrength');
    if (!strengthEl) return;
    
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    
    const bars = strengthEl.querySelectorAll('.strength-bar');
    bars.forEach((bar, index) => {
        if (index < strength) {
            bar.classList.add('active');
        } else {
            bar.classList.remove('active');
        }
    });
    
    strengthEl.classList.remove('weak', 'medium', 'strong', 'very-strong');
    
    if (strength === 1) {
        strengthEl.classList.add('weak');
        strengthEl.querySelector('.strength-text').textContent = 'Weak password';
    } else if (strength === 2) {
        strengthEl.classList.add('medium');
        strengthEl.querySelector('.strength-text').textContent = 'Medium password';
    } else if (strength === 3) {
        strengthEl.classList.add('strong');
        strengthEl.querySelector('.strength-text').textContent = 'Strong password';
    } else if (strength === 4) {
        strengthEl.classList.add('very-strong');
        strengthEl.querySelector('.strength-text').textContent = 'Very strong password';
    }
}

// Social Login (placeholder)
function socialLogin(provider) {
    showMessage(`Social login with ${provider} - Coming soon!`, 'info');
}

// Login Form Handler
function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, rememberMe })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }
            
            const data = await response.json();
            
            // Store token and user info
            TokenManager.setToken(data.token);
            UserManager.setUser(data.user);
            
            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } catch (error) {
            console.error('Login error:', error);
            showMessage(error.message || 'Login failed. Please check your credentials.', 'error');
            
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// Register Form Handler
function initRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    
    // Password strength checker
    const passwordInput = document.getElementById('passwordReg');
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            checkPasswordStrength(e.target.value);
        });
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('emailReg').value;
        const password = document.getElementById('passwordReg').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Validation
        if (password !== confirmPassword) {
            showMessage('Passwords do not match!', 'error');
            return;
        }
        
        if (!agreeTerms) {
            showMessage('Please agree to the Terms of Service and Privacy Policy', 'error');
            return;
        }
        
        if (password.length < 8) {
            showMessage('Password must be at least 8 characters long', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }
            
            const data = await response.json();
            
            // Store token and user info
            TokenManager.setToken(data.token);
            UserManager.setUser(data.user);
            
            showMessage('Registration successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } catch (error) {
            console.error('Registration error:', error);
            showMessage(error.message || 'Registration failed. Please try again.', 'error');
            
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// Check if user is already authenticated
function checkAuthentication() {
    if (TokenManager.isAuthenticated()) {
        const currentPage = window.location.pathname;
        if (currentPage.includes('login.html') || currentPage.includes('register.html')) {
            window.location.href = 'dashboard.html';
        }
    }
}

// Logout function
function logout() {
    TokenManager.removeToken();
    UserManager.removeUser();
    window.location.href = 'login.html';
}

// Protected API call with authentication
async function authenticatedFetch(endpoint, options = {}) {
    const token = TokenManager.getToken();
    
    if (!token) {
        window.location.href = 'login.html';
        throw new Error('Not authenticated');
    }
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);
        
        if (response.status === 401) {
            // Token expired or invalid
            TokenManager.removeToken();
            UserManager.removeUser();
            window.location.href = 'login.html';
            throw new Error('Session expired');
        }
        
        return response;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    checkAuthentication();
    
    // Initialize forms
    initLoginForm();
    initRegisterForm();
    
    console.log('Authentication system initialized');
});

// Export functions for use in other scripts
window.AuthModule = {
    TokenManager,
    UserManager,
    authenticatedFetch,
    logout,
    showMessage
};
