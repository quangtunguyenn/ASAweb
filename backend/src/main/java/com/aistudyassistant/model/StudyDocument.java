package com.aistudyassistant.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Main document entity for AI Study Engine
 * Represents an uploaded document with AI-generated learning materials
 */
@Entity
@Table(name = "study_documents")
public class StudyDocument {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 2000)
    private String description;
    
    @Column(nullable = false)
    private String originalFileName;
    
    @Column(nullable = false)
    private String storedFileName;
    
    @Column(nullable = false)
    private String filePath;
    
    @Column(nullable = false)
    private String fileType; // pdf, docx, txt, etc.
    
    @Column(nullable = false)
    private Long fileSize;
    
    // AI-generated content
    @Column(columnDefinition = "LONGTEXT")
    private String extractedText;
    
    @Column(columnDefinition = "TEXT")
    private String summary;
    
    @Column(columnDefinition = "TEXT")
    private String keyPoints;
    
    // Processing status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProcessingStatus status = ProcessingStatus.PENDING;
    
    @Column
    private Integer processingProgress = 0; // 0-100
    
    @Column(length = 1000)
    private String processingError;
    
    // Learning materials generated
    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Quiz> quizzes = new ArrayList<>();
    
    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Flashcard> flashcards = new ArrayList<>();
    
    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> chatHistory = new ArrayList<>();
    
    @Column
    private String mindmapUrl;
    
    @Column
    private String summaryPdfUrl;
    
    // Metadata
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "last_accessed")
    private LocalDateTime lastAccessed;
    
    @Column
    private Integer viewCount = 0;
    
    // Tags for categorization
    @Column(length = 500)
    private String tags; // Comma-separated tags
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        lastAccessed = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Enums
    public enum ProcessingStatus {
        PENDING,
        EXTRACTING_TEXT,
        GENERATING_SUMMARY,
        GENERATING_QUIZ,
        GENERATING_FLASHCARDS,
        GENERATING_MINDMAP,
        COMPLETED,
        FAILED
    }
    
    // Constructors
    public StudyDocument() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
    
    public String getStoredFileName() { return storedFileName; }
    public void setStoredFileName(String storedFileName) { this.storedFileName = storedFileName; }
    
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public String getExtractedText() { return extractedText; }
    public void setExtractedText(String extractedText) { this.extractedText = extractedText; }
    
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    
    public String getKeyPoints() { return keyPoints; }
    public void setKeyPoints(String keyPoints) { this.keyPoints = keyPoints; }
    
    public ProcessingStatus getStatus() { return status; }
    public void setStatus(ProcessingStatus status) { this.status = status; }
    
    public Integer getProcessingProgress() { return processingProgress; }
    public void setProcessingProgress(Integer processingProgress) { this.processingProgress = processingProgress; }
    
    public String getProcessingError() { return processingError; }
    public void setProcessingError(String processingError) { this.processingError = processingError; }
    
    public List<Quiz> getQuizzes() { return quizzes; }
    public void setQuizzes(List<Quiz> quizzes) { this.quizzes = quizzes; }
    
    public List<Flashcard> getFlashcards() { return flashcards; }
    public void setFlashcards(List<Flashcard> flashcards) { this.flashcards = flashcards; }
    
    public List<ChatMessage> getChatHistory() { return chatHistory; }
    public void setChatHistory(List<ChatMessage> chatHistory) { this.chatHistory = chatHistory; }
    
    public String getMindmapUrl() { return mindmapUrl; }
    public void setMindmapUrl(String mindmapUrl) { this.mindmapUrl = mindmapUrl; }
    
    public String getSummaryPdfUrl() { return summaryPdfUrl; }
    public void setSummaryPdfUrl(String summaryPdfUrl) { this.summaryPdfUrl = summaryPdfUrl; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getLastAccessed() { return lastAccessed; }
    public void setLastAccessed(LocalDateTime lastAccessed) { this.lastAccessed = lastAccessed; }
    
    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }
    
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    
    // Helper methods
    public void incrementViewCount() {
        this.viewCount++;
        this.lastAccessed = LocalDateTime.now();
    }
}
