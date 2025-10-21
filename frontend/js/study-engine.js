// AI Study Engine JavaScript
const API_URL = 'http://localhost:8080/api/study';
let selectedFile = null;
let currentDocument = null;
let currentQuizIndex = 0;
let currentFlashcardIndex = 0;
let quizData = [];
let flashcardsData = [];
let processingInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeFileUpload();
    loadDocuments();
    loadUserData();
});

// User Data
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = document.getElementById('userName');
    const userInitials = document.getElementById('userInitials');
    
    if (userName && user.fullName) {
        userName.textContent = user.fullName;
    }
    
    if (userInitials && user.fullName) {
        const initials = user.fullName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
        userInitials.textContent = initials;
    }
}

// File Upload
function initializeFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    
    // Drag and drop
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
            handleFileSelect(files[0]);
        }
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });
}

function handleFileSelect(file) {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (!allowedTypes.includes(file.type)) {
        alert('Chỉ chấp nhận file PDF, DOCX, hoặc TXT');
        return;
    }
    
    if (file.size > maxSize) {
        alert('File không được vượt quá 50MB');
        return;
    }
    
    selectedFile = file;
    document.getElementById('uploadMetadata').style.display = 'block';
    document.getElementById('docTitle').value = file.name.replace(/\.[^/.]+$/, '');
}

async function uploadDocument() {
    if (!selectedFile) return;
    
    const title = document.getElementById('docTitle').value || selectedFile.name;
    const description = document.getElementById('docDescription').value || '';
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('description', description);
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        
        const data = await response.json();
        
        // Show processing card
        document.getElementById('processingCard').style.display = 'block';
        document.getElementById('uploadMetadata').style.display = 'none';
        document.getElementById('fileInput').value = '';
        selectedFile = null;
        
        // Start polling for progress
        startProgressPolling(data.id);
        
        // Reload documents
        setTimeout(() => loadDocuments(), 1000);
        
    } catch (error) {
        console.error('Upload error:', error);
        alert('Upload thất bại. Vui lòng thử lại.');
    }
}

function startProgressPolling(documentId) {
    if (processingInterval) {
        clearInterval(processingInterval);
    }
    
    processingInterval = setInterval(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/documents/${documentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch document');
            }
            
            const doc = await response.json();
            updateProcessingProgress(doc);
            
            if (doc.processingStatus === 'COMPLETED' || doc.processingStatus === 'FAILED') {
                clearInterval(processingInterval);
                setTimeout(() => {
                    document.getElementById('processingCard').style.display = 'none';
                    loadDocuments();
                }, 2000);
            }
            
        } catch (error) {
            console.error('Polling error:', error);
            clearInterval(processingInterval);
        }
    }, 2000);
}

function updateProcessingProgress(doc) {
    const progress = doc.processingProgress || 0;
    const status = doc.processingStatus;
    
    document.getElementById('progressBar').style.width = `${progress}%`;
    
    const statusText = {
        'PENDING': 'Đang chờ xử lý...',
        'EXTRACTING_TEXT': 'Đang trích xuất văn bản...',
        'GENERATING_SUMMARY': 'Đang tạo tóm tắt...',
        'GENERATING_QUIZ': 'Đang tạo câu hỏi...',
        'GENERATING_FLASHCARDS': 'Đang tạo flashcards...',
        'GENERATING_MINDMAP': 'Đang tạo mindmap...',
        'COMPLETED': 'Hoàn thành!',
        'FAILED': 'Lỗi xử lý'
    };
    
    document.getElementById('processingStatus').textContent = statusText[status] || status;
    
    // Update steps
    const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];
    const statusToStep = {
        'EXTRACTING_TEXT': 0,
        'GENERATING_SUMMARY': 1,
        'GENERATING_QUIZ': 2,
        'GENERATING_FLASHCARDS': 3,
        'GENERATING_MINDMAP': 4,
        'COMPLETED': 5
    };
    
    const currentStep = statusToStep[status] || 0;
    
    steps.forEach((stepId, index) => {
        const stepElement = document.getElementById(stepId);
        stepElement.classList.remove('active', 'completed');
        
        if (index < currentStep) {
            stepElement.classList.add('completed');
        } else if (index === currentStep) {
            stepElement.classList.add('active');
        }
    });
}

// Load Documents
async function loadDocuments() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/documents`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load documents');
        }
        
        const documents = await response.json();
        displayDocuments(documents);
        
    } catch (error) {
        console.error('Load documents error:', error);
    }
}

function displayDocuments(documents) {
    const grid = document.getElementById('documentsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (documents.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    grid.innerHTML = documents.map(doc => `
        <div class="document-card" onclick="openDocument(${doc.id})">
            <span class="document-status ${doc.processingStatus.toLowerCase()}">
                ${doc.processingStatus === 'COMPLETED' ? '✓ Hoàn thành' : 
                  doc.processingStatus === 'PROCESSING' ? '⏳ Đang xử lý' : 
                  '⏸ Chờ xử lý'}
            </span>
            <h3>${doc.title}</h3>
            <p>${doc.description || 'Không có mô tả'}</p>
            <div class="document-stats">
                <div class="stat">
                    <span class="stat-icon">❓</span>
                    <span>${doc.quizCount || 0} câu hỏi</span>
                </div>
                <div class="stat">
                    <span class="stat-icon">🎴</span>
                    <span>${doc.flashcardCount || 0} flashcards</span>
                </div>
                <div class="stat">
                    <span class="stat-icon">👁</span>
                    <span>${doc.viewCount || 0} lượt xem</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Document Detail
async function openDocument(documentId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/documents/${documentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load document');
        }
        
        currentDocument = await response.json();
        displayDocumentDetail(currentDocument);
        
        document.getElementById('documentModal').classList.add('active');
        
    } catch (error) {
        console.error('Load document error:', error);
        alert('Không thể tải tài liệu');
    }
}

function closeDocumentModal() {
    document.getElementById('documentModal').classList.remove('active');
    currentDocument = null;
}

function displayDocumentDetail(doc) {
    document.getElementById('modalDocTitle').textContent = doc.title;
    document.getElementById('modalDocDate').textContent = formatDate(doc.uploadDate);
    document.getElementById('modalDocSize').textContent = formatFileSize(doc.fileSize);
    
    // Display summary
    displaySummary(doc);
}

function displaySummary(doc) {
    const keyPointsContainer = document.getElementById('keyPoints');
    const summaryContainer = document.getElementById('fullSummary');
    
    if (doc.keyPoints) {
        const points = doc.keyPoints.split('\n').filter(p => p.trim());
        keyPointsContainer.innerHTML = points.map((point, index) => `
            <div class="key-point">
                <div class="key-point-icon">${index + 1}️⃣</div>
                <div class="key-point-text">${point}</div>
            </div>
        `).join('');
    }
    
    if (doc.summary) {
        summaryContainer.textContent = doc.summary;
    }
}

// Tabs
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Load content
    if (tabName === 'quiz') {
        loadQuiz();
    } else if (tabName === 'flashcards') {
        loadFlashcards();
    } else if (tabName === 'chat') {
        loadChatHistory();
    }
}

// Quiz
async function loadQuiz() {
    if (!currentDocument) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/documents/${currentDocument.id}/quizzes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load quiz');
        }
        
        quizData = await response.json();
        currentQuizIndex = 0;
        displayQuizQuestion();
        
    } catch (error) {
        console.error('Load quiz error:', error);
        document.getElementById('quizContainer').innerHTML = '<p>Không thể tải quiz</p>';
    }
}

function displayQuizQuestion() {
    if (quizData.length === 0) {
        document.getElementById('quizContainer').innerHTML = '<p>Chưa có câu hỏi nào</p>';
        return;
    }
    
    const quiz = quizData[0];
    const question = quiz.questions[currentQuizIndex];
    
    if (!question) return;
    
    const container = document.getElementById('quizContainer');
    container.innerHTML = `
        <div class="quiz-question">
            <div class="question-header">
                <span class="question-number">Câu ${currentQuizIndex + 1}/${quiz.questions.length}</span>
                <span class="question-difficulty ${question.difficultyLevel.toLowerCase()}">${question.difficultyLevel}</span>
            </div>
            <div class="question-text">${question.questionText}</div>
            <div class="quiz-options">
                <div class="quiz-option" onclick="selectQuizOption(this, 'A')">
                    <div class="option-letter">A</div>
                    <div class="option-text">${question.optionA}</div>
                </div>
                <div class="quiz-option" onclick="selectQuizOption(this, 'B')">
                    <div class="option-letter">B</div>
                    <div class="option-text">${question.optionB}</div>
                </div>
                <div class="quiz-option" onclick="selectQuizOption(this, 'C')">
                    <div class="option-letter">C</div>
                    <div class="option-text">${question.optionC}</div>
                </div>
                <div class="quiz-option" onclick="selectQuizOption(this, 'D')">
                    <div class="option-letter">D</div>
                    <div class="option-text">${question.optionD}</div>
                </div>
            </div>
            <div class="question-explanation" id="explanation">
                <div class="explanation-label">💡 Giải thích:</div>
                <div class="explanation-text">${question.explanation}</div>
            </div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
            <button class="btn-secondary" onclick="previousQuestion()" ${currentQuizIndex === 0 ? 'disabled' : ''}>
                ← Câu trước
            </button>
            <button class="btn-secondary" onclick="nextQuestion()" ${currentQuizIndex === quiz.questions.length - 1 ? 'disabled' : ''}>
                Câu sau →
            </button>
        </div>
    `;
}

function selectQuizOption(element, option) {
    const question = quizData[0].questions[currentQuizIndex];
    
    // Remove previous selections
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'wrong');
    });
    
    // Mark selected
    element.classList.add('selected');
    
    // Show result
    if (option === question.correctAnswer) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
        // Highlight correct answer
        const options = document.querySelectorAll('.quiz-option');
        const correctIndex = question.correctAnswer.charCodeAt(0) - 'A'.charCodeAt(0);
        options[correctIndex].classList.add('correct');
    }
    
    // Show explanation
    document.getElementById('explanation').classList.add('show');
}

function nextQuestion() {
    if (currentQuizIndex < quizData[0].questions.length - 1) {
        currentQuizIndex++;
        displayQuizQuestion();
    }
}

function previousQuestion() {
    if (currentQuizIndex > 0) {
        currentQuizIndex--;
        displayQuizQuestion();
    }
}

// Flashcards
async function loadFlashcards() {
    if (!currentDocument) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/documents/${currentDocument.id}/flashcards`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load flashcards');
        }
        
        flashcardsData = await response.json();
        currentFlashcardIndex = 0;
        displayFlashcard();
        
    } catch (error) {
        console.error('Load flashcards error:', error);
        document.getElementById('flashcardContainer').innerHTML = '<p>Không thể tải flashcards</p>';
    }
}

function displayFlashcard() {
    if (flashcardsData.length === 0) {
        document.getElementById('flashcardContainer').innerHTML = '<p>Chưa có flashcard nào</p>';
        return;
    }
    
    const card = flashcardsData[currentFlashcardIndex];
    
    const container = document.getElementById('flashcardContainer');
    container.innerHTML = `
        <div class="flashcard" onclick="flipFlashcard(this)">
            <div class="flashcard-front">
                <div class="flashcard-category">${card.category}</div>
                <div class="flashcard-text">${card.frontText}</div>
                <div class="flashcard-hint">🔄 Nhấn để lật</div>
            </div>
            <div class="flashcard-back">
                <div class="flashcard-category">${card.category}</div>
                <div class="flashcard-text">${card.backText}</div>
                ${card.hint ? `<div class="flashcard-hint">💡 ${card.hint}</div>` : ''}
            </div>
        </div>
        <div class="flashcard-controls">
            <button class="flashcard-nav" onclick="previousFlashcard()" ${currentFlashcardIndex === 0 ? 'disabled' : ''}>
                ← Trước
            </button>
            <div class="flashcard-counter">
                ${currentFlashcardIndex + 1} / ${flashcardsData.length}
            </div>
            <button class="flashcard-nav" onclick="nextFlashcard()" ${currentFlashcardIndex === flashcardsData.length - 1 ? 'disabled' : ''}>
                Sau →
            </button>
        </div>
    `;
}

function flipFlashcard(element) {
    element.classList.toggle('flipped');
}

function nextFlashcard() {
    if (currentFlashcardIndex < flashcardsData.length - 1) {
        currentFlashcardIndex++;
        displayFlashcard();
    }
}

function previousFlashcard() {
    if (currentFlashcardIndex > 0) {
        currentFlashcardIndex--;
        displayFlashcard();
    }
}

// Chat
async function loadChatHistory() {
    if (!currentDocument) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/documents/${currentDocument.id}/chat/history`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load chat history');
        }
        
        const messages = await response.json();
        displayChatMessages(messages);
        
    } catch (error) {
        console.error('Load chat error:', error);
    }
}

function displayChatMessages(messages) {
    const container = document.getElementById('chatMessages');
    
    if (messages.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 2rem;">Bắt đầu trò chuyện với AI về tài liệu này</p>';
        return;
    }
    
    container.innerHTML = messages.map(msg => `
        <div class="chat-message ${msg.role.toLowerCase()}">
            <div class="message-avatar">${msg.role === 'USER' ? 'U' : 'AI'}</div>
            <div class="message-content">
                <div class="message-text">${msg.content}</div>
                <div class="message-time">${formatDate(msg.createdAt)}</div>
            </div>
        </div>
    `).join('');
    
    container.scrollTop = container.scrollHeight;
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || !currentDocument) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/documents/${currentDocument.id}/chat`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        
        const result = await response.json();
        
        // Add user message
        addChatMessage('USER', message);
        
        // Add AI response
        addChatMessage('ASSISTANT', result.response);
        
        input.value = '';
        
    } catch (error) {
        console.error('Send chat error:', error);
        alert('Không thể gửi tin nhắn');
    }
}

function addChatMessage(role, content) {
    const container = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role.toLowerCase()}`;
    messageDiv.innerHTML = `
        <div class="message-avatar">${role === 'USER' ? 'U' : 'AI'}</div>
        <div class="message-content">
            <div class="message-text">${content}</div>
            <div class="message-time">Vừa xong</div>
        </div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// Chat input enter key
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
});

// Download PDF
async function downloadSummaryPDF() {
    if (!currentDocument || !currentDocument.summaryPdfUrl) {
        alert('PDF chưa được tạo');
        return;
    }
    
    window.open(currentDocument.summaryPdfUrl, '_blank');
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Sidebar toggle
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

function toggleUserMenu() {
    // Implement user menu if needed
}

function toggleNotifications() {
    // Implement notifications if needed
}
