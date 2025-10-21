package com.aistudyassistant.repository;

import com.aistudyassistant.model.StudyDocument;
import com.aistudyassistant.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StudyDocumentRepository extends JpaRepository<StudyDocument, Long> {
    
    List<StudyDocument> findByUserOrderByCreatedAtDesc(User user);
    
    List<StudyDocument> findByUserAndStatusOrderByCreatedAtDesc(User user, StudyDocument.ProcessingStatus status);
    
    List<StudyDocument> findByUserAndCreatedAtAfterOrderByCreatedAtDesc(User user, LocalDateTime after);
    
    @Query("SELECT d FROM StudyDocument d WHERE d.user = ?1 AND (d.title LIKE %?2% OR d.description LIKE %?2%)")
    List<StudyDocument> searchByUserAndKeyword(User user, String keyword);
    
    @Query("SELECT d FROM StudyDocument d WHERE d.user = ?1 AND d.tags LIKE %?2%")
    List<StudyDocument> findByUserAndTag(User user, String tag);
    
    @Query("SELECT COUNT(d) FROM StudyDocument d WHERE d.user = ?1")
    Long countByUser(User user);
    
    @Query("SELECT COUNT(d) FROM StudyDocument d WHERE d.user = ?1 AND d.status = ?2")
    Long countByUserAndStatus(User user, StudyDocument.ProcessingStatus status);
}
