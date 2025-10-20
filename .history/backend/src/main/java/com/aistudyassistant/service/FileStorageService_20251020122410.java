package com.aistudyassistant.service;

import com.aistudyassistant.model.UploadedFile;
import com.aistudyassistant.repository.UploadedFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {
    
    @Autowired
    private UploadedFileRepository fileRepository;
    
    @Value("${upload.dir}")
    private String uploadDir;
    
    /**
     * Store uploaded file and save metadata to database
     */
    public UploadedFile storeFile(MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique file name to avoid conflicts
        String originalFileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        String storedFileName = UUID.randomUUID().toString() + fileExtension;
        
        // Store file
        Path targetLocation = uploadPath.resolve(storedFileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        // Save metadata to database
        UploadedFile uploadedFile = new UploadedFile(
            originalFileName,
            storedFileName,
            targetLocation.toString(),
            file.getContentType(),
            file.getSize()
        );
        
        return fileRepository.save(uploadedFile);
    }
    
    /**
     * Store multiple files
     */
    public List<UploadedFile> storeMultipleFiles(List<MultipartFile> files) throws IOException {
        return files.stream()
                .map(file -> {
                    try {
                        return storeFile(file);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to store file: " + file.getOriginalFilename(), e);
                    }
                })
                .toList();
    }
    
    /**
     * Get all uploaded files
     */
    public List<UploadedFile> getAllFiles() {
        return fileRepository.findAllByOrderByUploadDateDesc();
    }
    
    /**
     * Get file by ID
     */
    public UploadedFile getFileById(Long id) {
        return fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
    }
    
    /**
     * Delete file
     */
    public void deleteFile(Long id) throws IOException {
        UploadedFile file = getFileById(id);
        
        // Delete physical file
        Path filePath = Paths.get(file.getFilePath());
        Files.deleteIfExists(filePath);
        
        // Delete from database
        fileRepository.delete(file);
    }
    
    /**
     * Update file summary (for AI processing)
     */
    public UploadedFile updateFileSummary(Long id, String summary) {
        UploadedFile file = getFileById(id);
        file.setSummary(summary);
        file.setProcessed(true);
        return fileRepository.save(file);
    }
    
    /**
     * Get files by type
     */
    public List<UploadedFile> getFilesByType(String fileType) {
        return fileRepository.findByFileType(fileType);
    }
    
    /**
     * Get unprocessed files
     */
    public List<UploadedFile> getUnprocessedFiles() {
        return fileRepository.findByProcessed(false);
    }
    
    /**
     * Get recent files (last 7 days)
     */
    public List<UploadedFile> getRecentFiles() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        return fileRepository.findByUploadDateAfter(sevenDaysAgo);
    }
    
    /**
     * Get file statistics
     */
    public FileStats getFileStatistics() {
        long totalFiles = fileRepository.count();
        long processedFiles = fileRepository.findByProcessed(true).size();
        long unprocessedFiles = fileRepository.findByProcessed(false).size();
        
        return new FileStats(totalFiles, processedFiles, unprocessedFiles);
    }
    
    // Helper method to extract file extension
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }
    
    // Inner class for file statistics
    public static class FileStats {
        private long totalFiles;
        private long processedFiles;
        private long unprocessedFiles;
        
        public FileStats(long totalFiles, long processedFiles, long unprocessedFiles) {
            this.totalFiles = totalFiles;
            this.processedFiles = processedFiles;
            this.unprocessedFiles = unprocessedFiles;
        }
        
        // Getters
        public long getTotalFiles() { return totalFiles; }
        public long getProcessedFiles() { return processedFiles; }
        public long getUnprocessedFiles() { return unprocessedFiles; }
    }
}
