package com.aistudyassistant.model;

import jakarta.persistence.*;

/**
 * Individual quiz question entity
 */
@Entity
@Table(name = "quiz_questions")
public class QuizQuestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String optionA;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String optionB;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String optionC;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String optionD;
    
    @Column(nullable = false)
    private String correctAnswer; // A, B, C, or D
    
    @Column(columnDefinition = "TEXT")
    private String explanation;
    
    @Column(nullable = false)
    private Integer orderIndex = 0;
    
    // Constructors
    public QuizQuestion() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Quiz getQuiz() { return quiz; }
    public void setQuiz(Quiz quiz) { this.quiz = quiz; }
    
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    
    public String getOptionA() { return optionA; }
    public void setOptionA(String optionA) { this.optionA = optionA; }
    
    public String getOptionB() { return optionB; }
    public void setOptionB(String optionB) { this.optionB = optionB; }
    
    public String getOptionC() { return optionC; }
    public void setOptionC(String optionC) { this.optionC = optionC; }
    
    public String getOptionD() { return optionD; }
    public void setOptionD(String optionD) { this.optionD = optionD; }
    
    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
    
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}
