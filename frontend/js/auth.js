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
    messageEl.style.display = 'flex';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => {
            messageEl.style.display = 'none';
            messageEl.style.opacity = '1';
        }, 300);
    }, 5000);
}

// Show field error
function showFieldError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + 'Error');
    const inputEl = document.getElementById(fieldId);
    
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
    
    if (inputEl) {
        inputEl.classList.add('error');
        inputEl.classList.remove('success');
    }
}

// Clear field error
function clearFieldError(fieldId) {
    const errorEl = document.getElementById(fieldId + 'Error');
    const inputEl = document.getElementById(fieldId);
    
    if (errorEl) {
        errorEl.style.display = 'none';
    }
    
    if (inputEl) {
        inputEl.classList.remove('error');
    }
}

// Mark field as success
function markFieldSuccess(fieldId) {
    const inputEl = document.getElementById(fieldId);
    if (inputEl) {
        inputEl.classList.add('success');
        inputEl.classList.remove('error');
    }
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

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation
function isValidPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return password.length >= 8;
}

// Login Form Handler
function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Real-time email validation
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value.trim();
            if (!email) {
                showFieldError('email', 'Email is required');
            } else if (!isValidEmail(email)) {
                showFieldError('email', 'Please enter a valid email address');
            } else {
                clearFieldError('email');
                markFieldSuccess('email');
            }
        });
        
        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('error')) {
                clearFieldError('email');
            }
        });
    }
    
    // Real-time password validation
    if (passwordInput) {
        passwordInput.addEventListener('blur', () => {
            const password = passwordInput.value;
            if (!password) {
                showFieldError('password', 'Password is required');
            } else if (password.length < 6) {
                showFieldError('password', 'Password must be at least 6 characters');
            } else {
                clearFieldError('password');
                markFieldSuccess('password');
            }
        });
        
        passwordInput.addEventListener('input', () => {
            if (passwordInput.classList.contains('error')) {
                clearFieldError('password');
            }
        });
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = document.getElementById('rememberMe')?.checked || false;
        
        // Clear previous errors
        clearFieldError('email');
        clearFieldError('password');
        
        // Frontend validation
        let hasError = false;
        
        if (!email) {
            showFieldError('email', 'Email is required');
            hasError = true;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            hasError = true;
        }
        
        if (!password) {
            showFieldError('password', 'Password is required');
            hasError = true;
        } else if (password.length < 6) {
            showFieldError('password', 'Password must be at least 6 characters');
            hasError = true;
        }
        
        if (hasError) {
            return;
        }
        
        // Show loading state
        const submitBtn = document.getElementById('loginBtn') || form.querySelector('button[type="submit"]');
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
            const user = {
                accountName: `${data.firstName} ${data.lastName}`, // Full name as account name
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role
            };
            UserManager.setUser(user);
            
            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard-new.html';
            });
            
        } catch (error) {
            console.error('Login error:', error);
            
            // Professional error messages based on error type
            let errorMessage = 'Login failed. Please try again.';
            
            if (error.message) {
                const msg = error.message.toLowerCase();
                
                // Bad credentials or wrong password
                if (msg.includes('bad credentials') || msg.includes('incorrect password')) {
                    errorMessage = '🔒 Incorrect email or password. Please check your credentials and try again.';
                    emailInput.classList.add('error');
                    passwordInput.classList.add('error');
                }
                // User not found
                else if (msg.includes('user not found') || msg.includes('not found')) {
                    errorMessage = '👤 No account found with this email address. Please check your email or sign up for a new account.';
                    emailInput.classList.add('error');
                }
                // Account locked or disabled
                else if (msg.includes('locked') || msg.includes('disabled')) {
                    errorMessage = '🚫 Your account has been locked. Please contact support for assistance.';
                }
                // Network or server errors
                else if (msg.includes('network') || msg.includes('fetch')) {
                    errorMessage = '🌐 Connection error. Please check your internet connection and try again.';
                }
                // Session expired
                else if (msg.includes('expired') || msg.includes('timeout')) {
                    errorMessage = '⏱️ Your session has expired. Please try logging in again.';
                }
                // Generic server error
                else if (msg.includes('server') || msg.includes('500')) {
                    errorMessage = '⚠️ Server error. Our team has been notified. Please try again in a few moments.';
                }
                // Rate limiting
                else if (msg.includes('too many') || msg.includes('rate limit')) {
                    errorMessage = '⏸️ Too many login attempts. Please wait a few minutes before trying again.';
                }
                // Email format
                else if (msg.includes('invalid email') || msg.includes('email format')) {
                    errorMessage = '📧 Please enter a valid email address.';
                    emailInput.classList.add('error');
                }
                // Generic error - highlight both fields
                else {
                    errorMessage = `❌ ${error.message}`;
                    emailInput.classList.add('error');
                    passwordInput.classList.add('error');
                }
            }
            
            showMessage(errorMessage, 'error');
            
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
    
    const emailInput = document.getElementById('emailReg');
    const passwordInput = document.getElementById('passwordReg');
    const confirmInput = document.getElementById('confirmPassword');
    
    // Real-time email validation
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value.trim();
            if (email && !isValidEmail(email)) {
                showFieldError('email', 'Please enter a valid email address');
            } else if (email) {
                clearFieldError('email');
                markFieldSuccess('emailReg');
            }
        });
        
        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('error')) {
                clearFieldError('email');
            }
        });
    }
    
    // Password strength checker
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            checkPasswordStrength(e.target.value);
            
            // Clear confirm password error when main password changes
            if (confirmInput && confirmInput.value) {
                clearFieldError('confirm');
            }
        });
    }
    
    // Confirm password validation
    if (confirmInput) {
        confirmInput.addEventListener('blur', () => {
            const password = passwordInput.value;
            const confirm = confirmInput.value;
            
            if (confirm && password !== confirm) {
                showFieldError('confirm', 'Passwords do not match');
            } else if (confirm) {
                clearFieldError('confirm');
                markFieldSuccess('confirmPassword');
            }
        });
        
        confirmInput.addEventListener('input', () => {
            if (confirmInput.classList.contains('error')) {
                clearFieldError('confirm');
            }
        });
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const accountName = document.getElementById('accountName').value.trim();
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;
        const agreeTerms = document.getElementById('agreeTerms')?.checked || false;
        
        // Clear previous errors
        clearFieldError('email');
        clearFieldError('confirm');
        
        // Validation
        let hasError = false;
        
        if (!accountName) {
            showMessage('Please enter your account name', 'error');
            hasError = true;
        }
        
        if (!firstName || !lastName) {
            showMessage('Please enter your first and last name', 'error');
            hasError = true;
        }
        
        if (!email) {
            showFieldError('email', 'Email is required');
            hasError = true;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            hasError = true;
        }
        
        if (!password) {
            showMessage('Please enter a password', 'error');
            hasError = true;
        } else if (password.length < 8) {
            showMessage('Password must be at least 8 characters long', 'error');
            hasError = true;
        } else if (!isValidPassword(password)) {
            showMessage('Password must contain at least 8 characters', 'error');
            hasError = true;
        }
        
        if (password !== confirmPassword) {
            showFieldError('confirm', 'Passwords do not match');
            hasError = true;
        }
        
        if (!agreeTerms) {
            showMessage('Please agree to the Terms of Service and Privacy Policy', 'error');
            hasError = true;
        }
        
        if (hasError) {
            return;
        }
        
        // Show loading state
        const submitBtn = document.getElementById('registerBtn') || form.querySelector('button[type="submit"]');
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
            
            // Store token and user info with account name
            TokenManager.setToken(data.token);
            const user = {
                accountName: accountName, // Display name for dashboard
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role
            };
            UserManager.setUser(user);
            
            showMessage('Registration successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard-new.html';
            }, 1000);
            
        } catch (error) {
            console.error('Registration error:', error);
            
            // Professional error messages for registration
            let errorMessage = 'Registration failed. Please try again.';
            
            if (error.message) {
                const msg = error.message.toLowerCase();
                
                // Email already exists
                if (msg.includes('already registered') || msg.includes('email already') || msg.includes('already exists')) {
                    errorMessage = '📧 This email is already registered. Please <a href="login.html" style="color: inherit; text-decoration: underline;">log in</a> instead or use a different email address.';
                }
                // Invalid email format
                else if (msg.includes('invalid email') || msg.includes('email format')) {
                    errorMessage = '📧 Please enter a valid email address.';
                }
                // Weak password
                else if (msg.includes('password') && (msg.includes('weak') || msg.includes('strength'))) {
                    errorMessage = '🔐 Password is too weak. Please use at least 8 characters with a mix of letters and numbers.';
                }
                // Network error
                else if (msg.includes('network') || msg.includes('fetch')) {
                    errorMessage = '🌐 Connection error. Please check your internet connection and try again.';
                }
                // Server error
                else if (msg.includes('server') || msg.includes('500')) {
                    errorMessage = '⚠️ Server error. Our team has been notified. Please try again in a few moments.';
                }
                // Rate limiting
                else if (msg.includes('too many') || msg.includes('rate limit')) {
                    errorMessage = '⏸️ Too many registration attempts. Please wait a few minutes before trying again.';
                }
                // Generic error with specific message
                else if (error.message && !msg.includes('failed')) {
                    errorMessage = `❌ ${error.message}`;
                }
            }
            
            showMessage(errorMessage, 'error');
            
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
            window.location.href = 'dashboard-new.html';
        }
    }
}

// Logout function
function logout(event) {
    if (event) {
        event.preventDefault();
    }
    
    // Confirm logout
    if (!confirm('Are you sure you want to log out?')) {
        return;
    }
    
    // Clear all auth data
    TokenManager.removeToken();
    UserManager.removeUser();
    
    // Clear any other stored data
    localStorage.removeItem('rememberMe');
    sessionStorage.clear();
    
    // Show logout message
    console.log('User logged out successfully');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Global logout function for onclick
window.logout = logout;

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
