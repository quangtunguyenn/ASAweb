// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Navigation Helper
function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Simple notification system (can be enhanced later)
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 2rem;
        background-color: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#4F46E5'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// API Helper Functions
async function apiCall(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        
        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        showNotification('Failed to connect to server', 'error');
        throw error;
    }
}

// ============================================
// PHASE 2: FILE UPLOAD FUNCTIONALITY
// ============================================

let uploadedFiles = [];

// Initialize file upload functionality
function initFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadZone = document.getElementById('uploadZone');
    
    // File input change handler
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Drag and drop handlers
    if (uploadZone) {
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0]);
            }
        });
    }
    
    // Load existing files
    loadFiles();
    loadStatistics();
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        handleFileUpload(file);
    }
}

// Upload file to backend
async function handleFileUpload(file) {
    const progressDiv = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    try {
        // Show progress
        progressDiv.style.display = 'block';
        progressFill.style.width = '30%';
        progressText.textContent = `Uploading ${file.name}...`;
        
        // Create form data
        const formData = new FormData();
        formData.append('file', file);
        
        // Upload file
        const response = await fetch(`${API_BASE_URL}/files/upload`, {
            method: 'POST',
            body: formData
        });
        
        progressFill.style.width = '70%';
        progressText.textContent = 'Processing file...';
        
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        
        const result = await response.json();
        
        // Complete
        progressFill.style.width = '100%';
        progressText.textContent = 'Upload complete!';
        
        showNotification(`${file.name} uploaded successfully!`, 'success');
        
        // Reload files and stats
        await loadFiles();
        await loadStatistics();
        
        // Hide progress after 1 second
        setTimeout(() => {
            progressDiv.style.display = 'none';
            progressFill.style.width = '0%';
            document.getElementById('fileInput').value = '';
        }, 1000);
        
    } catch (error) {
        console.error('Upload error:', error);
        progressDiv.style.display = 'none';
        showNotification('Failed to upload file. Make sure the server is running.', 'error');
    }
}

// Load files from backend
async function loadFiles() {
    try {
        const response = await fetch(`${API_BASE_URL}/files`);
        
        if (!response.ok) {
            throw new Error('Failed to load files');
        }
        
        uploadedFiles = await response.json();
        displayFiles();
        
    } catch (error) {
        console.error('Error loading files:', error);
        const filesList = document.getElementById('filesList');
        if (filesList) {
            filesList.innerHTML = '<p class="empty-state">Unable to connect to server. Please ensure the backend is running on port 8080.</p>';
        }
    }
}

// Display files in the UI
function displayFiles() {
    const filesList = document.getElementById('filesList');
    
    if (!filesList) return;
    
    if (uploadedFiles.length === 0) {
        filesList.innerHTML = '<p class="empty-state">No files uploaded yet. Upload your first file to get started!</p>';
        return;
    }
    
    filesList.innerHTML = uploadedFiles.map(file => `
        <div class="file-item">
            <div class="file-info">
                <div class="file-name">📄 ${file.originalFileName}</div>
                <div class="file-meta">
                    <span>📅 ${formatDate(file.uploadDate)}</span>
                    <span>💾 ${formatFileSize(file.fileSize)}</span>
                    <span>📝 ${file.fileType || 'Unknown'}</span>
                    <span>${file.processed ? '✅ Processed' : '⏳ Processing'}</span>
                </div>
                ${file.summary ? `
                    <div class="file-summary">
                        <strong>📋 AI Summary:</strong><br>
                        ${file.summary}
                    </div>
                ` : ''}
            </div>
            <div class="file-actions">
                <button class="action-btn btn-download" onclick="downloadFile(${file.id}, '${file.originalFileName}')">
                    ⬇️ Download
                </button>
                <button class="action-btn btn-delete" onclick="deleteFile(${file.id})">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Load file statistics
async function loadStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/files/stats`);
        
        if (!response.ok) {
            throw new Error('Failed to load statistics');
        }
        
        const stats = await response.json();
        
        // Update stat displays
        document.getElementById('totalFiles').textContent = stats.totalFiles || 0;
        document.getElementById('processedFiles').textContent = stats.processedFiles || 0;
        document.getElementById('totalSize').textContent = formatFileSize(stats.totalSize || 0);
        
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Delete file
async function deleteFile(fileId) {
    if (!confirm('Are you sure you want to delete this file?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Delete failed');
        }
        
        showNotification('File deleted successfully', 'success');
        await loadFiles();
        await loadStatistics();
        
    } catch (error) {
        console.error('Delete error:', error);
        showNotification('Failed to delete file', 'error');
    }
}

// Download file
async function downloadFile(fileId, fileName) {
    try {
        const response = await fetch(`${API_BASE_URL}/files/${fileId}/download`);
        
        if (!response.ok) {
            throw new Error('Download failed');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showNotification('Download started', 'success');
        
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Failed to download file', 'error');
    }
}

// Utility: Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Utility: Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================================
// APP INITIALIZATION
// ============================================

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('AI Study Assistant loaded successfully! 🎓');
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize Phase 2 functionality
    initFileUpload();
});

// ============================================
// FUTURE PHASES (Coming Soon)
// ============================================
// Phase 3: AI Chat & Q&A Functions
// Phase 4: Study Dashboard Functions
// Phase 5: Productivity Tools Functions
// Phase 6: AI Study Coach Functions
