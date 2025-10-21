// File Upload JavaScript
const API_URL = 'http://localhost:8080/api';
let allFiles = [];
let currentFilter = 'all';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFileUpload();
    loadUserFiles();
    setupEventListeners();
});

// Initialize file upload functionality
function initializeFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    uploadZone.addEventListener('drop', handleDrop, false);

    // Handle file input change
    fileInput.addEventListener('change', handleFileSelect, false);

    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    document.getElementById('uploadZone').classList.add('drag-over');
}

function unhighlight(e) {
    document.getElementById('uploadZone').classList.remove('drag-over');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles([...files]);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles([...files]);
}

function handleFiles(files) {
    if (files.length === 0) return;

    // Show progress container
    const progressContainer = document.getElementById('uploadProgressContainer');
    progressContainer.style.display = 'block';

    // Upload each file
    files.forEach(file => {
        uploadFile(file);
    });
}

async function uploadFile(file) {
    const progressList = document.getElementById('uploadProgressList');
    
    // Create progress item
    const progressItem = createProgressItem(file);
    progressList.appendChild(progressItem);

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);

    try {
        const token = localStorage.getItem('token');
        
        // Simulate upload progress
        const progressBar = progressItem.querySelector('.progress-bar');
        const progressStatus = progressItem.querySelector('.progress-status');
        
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 90) {
                clearInterval(progressInterval);
            }
        }, 200);

        // Upload file to backend
        const response = await fetch(`${API_URL}/files/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        clearInterval(progressInterval);
        progressBar.style.width = '100%';

        if (response.ok) {
            const result = await response.json();
            progressStatus.innerHTML = `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px;height:16px">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Upload complete
            `;
            progressStatus.classList.add('success');
            
            // Wait then remove progress item
            setTimeout(() => {
                progressItem.style.opacity = '0';
                setTimeout(() => progressItem.remove(), 300);
            }, 2000);

            // Reload file list
            setTimeout(() => loadUserFiles(), 2000);
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Upload error:', error);
        const progressStatus = progressItem.querySelector('.progress-status');
        progressStatus.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px;height:16px">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Upload failed
        `;
        progressStatus.classList.add('error');
    }
}

function createProgressItem(file) {
    const item = document.createElement('div');
    item.className = 'upload-progress-item';
    
    const fileIcon = getFileIcon(file.name);
    const fileSize = formatFileSize(file.size);
    
    item.innerHTML = `
        <div class="progress-file-icon">${fileIcon}</div>
        <div class="progress-file-info">
            <div class="progress-file-name">${file.name}</div>
            <div class="progress-file-size">${fileSize}</div>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: 0%"></div>
            </div>
        </div>
        <div class="progress-status">
            <svg class="animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px;height:16px">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Uploading...
        </div>
    `;
    
    return item;
}

// Load user files from backend
async function loadUserFiles() {
    const fileGrid = document.getElementById('fileGrid');
    fileGrid.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading files...</p>
        </div>
    `;

    try {
        const token = localStorage.getItem('token');
        
        // For demo purposes, show sample files if backend is not ready
        // In production, this should fetch from backend
        const response = await fetch(`${API_URL}/files`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).catch(() => null);

        let files = [];
        
        if (response && response.ok) {
            files = await response.json();
        } else {
            // Demo data for testing
            files = generateDemoFiles();
        }

        allFiles = files;
        displayFiles(files);
    } catch (error) {
        console.error('Error loading files:', error);
        // Show demo files on error
        allFiles = generateDemoFiles();
        displayFiles(allFiles);
    }
}

function generateDemoFiles() {
    return [
        {
            id: 1,
            name: 'Linear Algebra Notes.pdf',
            type: 'pdf',
            size: 2457600,
            uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            url: '#'
        },
        {
            id: 2,
            name: 'Physics Assignment.docx',
            type: 'docx',
            size: 1048576,
            uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            url: '#'
        },
        {
            id: 3,
            name: 'Chemistry Lab Report.pdf',
            type: 'pdf',
            size: 3145728,
            uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            url: '#'
        },
        {
            id: 4,
            name: 'Study Schedule.xlsx',
            type: 'xlsx',
            size: 524288,
            uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            url: '#'
        },
        {
            id: 5,
            name: 'Mind Map.png',
            type: 'image',
            size: 1572864,
            uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            url: '#'
        },
        {
            id: 6,
            name: 'History Essay.docx',
            type: 'docx',
            size: 786432,
            uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            url: '#'
        }
    ];
}

function displayFiles(files) {
    const fileGrid = document.getElementById('fileGrid');
    
    if (files.length === 0) {
        fileGrid.innerHTML = `
            <div class="loading-spinner">
                <p>No files uploaded yet</p>
            </div>
        `;
        return;
    }

    fileGrid.innerHTML = files.map(file => createFileCard(file)).join('');
}

function createFileCard(file) {
    const fileIcon = getFileIcon(file.name);
    const fileSize = formatFileSize(file.size);
    const uploadDate = formatDate(file.uploadedAt);
    const fileTypeClass = getFileType(file.name);
    
    return `
        <div class="file-card" data-file-id="${file.id}" data-file-type="${fileTypeClass}">
            <div class="file-icon ${fileTypeClass}">${fileIcon}</div>
            <div class="file-name" title="${file.name}">${file.name}</div>
            <div class="file-meta">
                <span>${fileSize}</span>
                <span>${uploadDate}</span>
            </div>
            <div class="file-actions">
                <button class="file-action-btn view" onclick="viewFile(${file.id})">View</button>
                <button class="file-action-btn download" onclick="downloadFile(${file.id}, '${file.name}')">Download</button>
                <button class="file-action-btn delete" onclick="deleteFile(${file.id})">Delete</button>
            </div>
        </div>
    `;
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
        'pdf': '📄',
        'doc': '📝',
        'docx': '📝',
        'txt': '📑',
        'xlsx': '📊',
        'xls': '📊',
        'ppt': '📊',
        'pptx': '📊',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'png': '🖼️',
        'gif': '🖼️',
        'zip': '📦',
        'rar': '📦'
    };
    return iconMap[ext] || '📄';
}

function getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx', 'txt'].includes(ext)) return 'docx';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
    if (['xlsx', 'xls'].includes(ext)) return 'xlsx';
    return 'other';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(date) {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - d);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return d.toLocaleDateString();
}

// File actions
window.viewFile = function(fileId) {
    const file = allFiles.find(f => f.id === fileId);
    if (!file) return;
    
    const modal = document.getElementById('filePreviewModal');
    const fileName = document.getElementById('previewFileName');
    const previewContent = document.getElementById('previewContent');
    
    fileName.textContent = file.name;
    
    // Show preview based on file type
    const fileType = getFileType(file.name);
    if (fileType === 'image') {
        previewContent.innerHTML = `<img src="${file.url}" alt="${file.name}" style="max-width:100%;border-radius:8px;">`;
    } else if (fileType === 'pdf') {
        previewContent.innerHTML = `<iframe src="${file.url}" style="width:100%;height:500px;border:none;border-radius:8px;"></iframe>`;
    } else {
        previewContent.innerHTML = `
            <div style="text-align:center;padding:3rem;">
                <div style="font-size:3rem;margin-bottom:1rem;">${getFileIcon(file.name)}</div>
                <h3>${file.name}</h3>
                <p style="color:#6B7280;margin-top:0.5rem;">Preview not available for this file type</p>
                <button class="btn-primary" onclick="downloadFile(${file.id}, '${file.name}')" style="margin-top:1.5rem;">
                    Download to view
                </button>
            </div>
        `;
    }
    
    modal.classList.add('show');
};

window.downloadFile = async function(fileId, fileName) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/files/${fileId}/download`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            alert('Download failed. Please try again.');
        }
    } catch (error) {
        console.error('Download error:', error);
        alert('Download failed. File will be available after backend integration.');
    }
};

window.deleteFile = async function(fileId) {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/files/${fileId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            // Remove from local array
            allFiles = allFiles.filter(f => f.id !== fileId);
            displayFiles(allFiles);
            alert('File deleted successfully!');
        } else {
            throw new Error('Delete failed');
        }
    } catch (error) {
        console.error('Delete error:', error);
        // For demo, remove locally
        allFiles = allFiles.filter(f => f.id !== fileId);
        displayFiles(allFiles);
        alert('File deleted (demo mode)');
    }
};

window.closePreviewModal = function() {
    const modal = document.getElementById('filePreviewModal');
    modal.classList.remove('show');
};

window.refreshFiles = function() {
    loadUserFiles();
};

// Setup event listeners
function setupEventListeners() {
    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter files
            currentFilter = tab.dataset.filter;
            filterFiles(currentFilter);
        });
    });
    
    // Sort select
    const sortSelect = document.querySelector('.sort-select');
    sortSelect.addEventListener('change', (e) => {
        sortFiles(e.target.value);
    });
    
    // Close modal on outside click
    const modal = document.getElementById('filePreviewModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePreviewModal();
        }
    });
}

function filterFiles(filter) {
    let filtered = allFiles;
    
    if (filter !== 'all') {
        filtered = allFiles.filter(file => {
            const fileType = getFileType(file.name);
            return fileType === filter;
        });
    }
    
    displayFiles(filtered);
}

function sortFiles(sortBy) {
    let sorted = [...allFiles];
    
    switch(sortBy) {
        case 'Sort by Name':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'Sort by Size':
            sorted.sort((a, b) => b.size - a.size);
            break;
        case 'Sort by Type':
            sorted.sort((a, b) => getFileType(a.name).localeCompare(getFileType(b.name)));
            break;
        case 'Sort by Date':
        default:
            sorted.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
            break;
    }
    
    allFiles = sorted;
    filterFiles(currentFilter);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to close modal
    if (e.key === 'Escape') {
        closePreviewModal();
    }
    
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.header-search input').focus();
    }
});
