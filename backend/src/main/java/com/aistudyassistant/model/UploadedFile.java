package com.aistudyassistant.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "uploaded_files")
public class UploadedFile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String originalFileName;
    
    @Column(nullable = false)
    private String storedFileName;
    
    @Column(nullable = false)
    private String filePath;
    
    private String fileType;
    
    private Long fileSize;
    
    @Column(length = 1000)
    private String summary;
    
    @Column(name = "upload_date")
    private LocalDateTime uploadDate;
    
    @Column(name = "processed")
    private boolean processed = false;
    
    @PrePersist
    protected void onCreate() {
        uploadDate = LocalDateTime.now();
    }
    
    // Constructors
    public UploadedFile() {}
    
    public UploadedFile(String originalFileName, String storedFileName, String filePath, String fileType, Long fileSize) {
        this.originalFileName = originalFileName;
        this.storedFileName = storedFileName;
        this.filePath = filePath;
        this.fileType = fileType;
        this.fileSize = fileSize;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getOriginalFileName() {
        return originalFileName;
    }
    
    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }
    
    public String getStoredFileName() {
        return storedFileName;
    }
    
    public void setStoredFileName(String storedFileName) {
        this.storedFileName = storedFileName;
    }
    
    public String getFilePath() {
        return filePath;
    }
    
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
    
    public String getFileType() {
        return fileType;
    }
    
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
    
    public Long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }
    
    public String getSummary() {
        return summary;
    }
    
    public void setSummary(String summary) {
        this.summary = summary;
    }
    
    public LocalDateTime getUploadDate() {
        return uploadDate;
    }
    
    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
    
    public boolean isProcessed() {
        return processed;
    }
    
    public void setProcessed(boolean processed) {
        this.processed = processed;
    }
    
    @Override
    public String toString() {
        return "UploadedFile{" +
                "id=" + id +
                ", originalFileName='" + originalFileName + '\'' +
                ", fileType='" + fileType + '\'' +
                ", fileSize=" + fileSize +
                ", uploadDate=" + uploadDate +
                '}';
    }
}
