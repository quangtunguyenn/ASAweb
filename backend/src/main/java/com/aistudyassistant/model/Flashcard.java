package com.aistudyassistant.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Flashcard entity - AI-generated flashcards for memorization
 */
@Entity
@Table(name = "flashcards")
public class Flashcard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private StudyDocument document;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String front; // Question or term
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String back; // Answer or definition
    
    @Column(columnDefinition = "TEXT")
    private String hint;
    
    @Column(nullable = false)
    private Integer orderIndex = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category = Category.GENERAL;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum Category {
        GENERAL, DEFINITION, FORMULA, CONCEPT, FACT, DATE
    }
    
    // Constructors
    public Flashcard() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public StudyDocument getDocument() { return document; }
    public void setDocument(StudyDocument document) { this.document = document; }
    
    public String getFront() { return front; }
    public void setFront(String front) { this.front = front; }
    
    public String getBack() { return back; }
    public void setBack(String back) { this.back = back; }
    
    public String getHint() { return hint; }
    public void setHint(String hint) { this.hint = hint; }
    
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
