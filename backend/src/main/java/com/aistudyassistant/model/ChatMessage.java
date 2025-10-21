package com.aistudyassistant.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Chat message entity - AI chat based on document context
 */
@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private StudyDocument document;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageRole role; // USER or ASSISTANT
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Token usage for cost tracking
    @Column
    private Integer tokenCount;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum MessageRole {
        USER, ASSISTANT, SYSTEM
    }
    
    // Constructors
    public ChatMessage() {}
    
    public ChatMessage(StudyDocument document, User user, MessageRole role, String content) {
        this.document = document;
        this.user = user;
        this.role = role;
        this.content = content;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public StudyDocument getDocument() { return document; }
    public void setDocument(StudyDocument document) { this.document = document; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public MessageRole getRole() { return role; }
    public void setRole(MessageRole role) { this.role = role; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Integer getTokenCount() { return tokenCount; }
    public void setTokenCount(Integer tokenCount) { this.tokenCount = tokenCount; }
}
