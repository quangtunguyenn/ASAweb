package com.aistudyassistant.repository;

import com.aistudyassistant.model.Flashcard;
import com.aistudyassistant.model.StudyDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    
    List<Flashcard> findByDocumentOrderByOrderIndexAsc(StudyDocument document);
    
    List<Flashcard> findByDocumentAndCategoryOrderByOrderIndexAsc(StudyDocument document, Flashcard.Category category);
}
