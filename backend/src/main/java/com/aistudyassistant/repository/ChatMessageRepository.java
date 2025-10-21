package com.aistudyassistant.repository;

import com.aistudyassistant.model.ChatMessage;
import com.aistudyassistant.model.StudyDocument;
import com.aistudyassistant.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    List<ChatMessage> findByDocumentOrderByCreatedAtAsc(StudyDocument document);
    
    List<ChatMessage> findByDocumentAndUserOrderByCreatedAtAsc(StudyDocument document, User user);
    
    void deleteByDocument(StudyDocument document);
}
