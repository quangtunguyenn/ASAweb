package com.aistudyassistant.repository;

import com.aistudyassistant.model.UploadedFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UploadedFileRepository extends JpaRepository<UploadedFile, Long> {
    
    // Find files by original file name
    List<UploadedFile> findByOriginalFileName(String originalFileName);
    
    // Find files by file type
    List<UploadedFile> findByFileType(String fileType);
    
    // Find processed files
    List<UploadedFile> findByProcessed(boolean processed);
    
    // Find files uploaded after a certain date
    List<UploadedFile> findByUploadDateAfter(LocalDateTime date);
    
    // Find files uploaded between dates
    List<UploadedFile> findByUploadDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Count total files
    long count();
    
    // Get all files ordered by upload date (most recent first)
    List<UploadedFile> findAllByOrderByUploadDateDesc();
}
