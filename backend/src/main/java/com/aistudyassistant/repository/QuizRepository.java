package com.aistudyassistant.repository;

import com.aistudyassistant.model.Quiz;
import com.aistudyassistant.model.StudyDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    
    List<Quiz> findByDocumentOrderByCreatedAtDesc(StudyDocument document);
    
    List<Quiz> findByDocumentAndDifficultyOrderByCreatedAtDesc(StudyDocument document, Quiz.DifficultyLevel difficulty);
}
