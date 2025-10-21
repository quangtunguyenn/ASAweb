package com.aistudyassistant.controller;

import com.aistudyassistant.model.UploadedFile;
import com.aistudyassistant.service.AISummaryService;
import com.aistudyassistant.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileUploadController {
    
    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private AISummaryService aiSummaryService;
    
    /**
     * Upload single file
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        logger.info("Received file upload request: {}", file.getOriginalFilename());
        
        try {
            // Validate file
            if (file.isEmpty()) {
                logger.warn("Empty file received");
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Cannot upload empty file");
                return ResponseEntity.badRequest().body(response);
            }
            
            logger.info("File size: {} bytes", file.getSize());
            logger.info("File type: {}", file.getContentType());
            
            // Store file
            UploadedFile uploadedFile = fileStorageService.storeFile(file);
            logger.info("File stored successfully with ID: {}", uploadedFile.getId());
            
            // Generate summary (async in production)
            try {
                String summary = aiSummaryService.generateSummary(uploadedFile);
                uploadedFile = fileStorageService.updateFileSummary(uploadedFile.getId(), summary);
                logger.info("Summary generated successfully");
            } catch (Exception e) {
                logger.warn("Failed to generate summary: {}", e.getMessage());
                // Continue even if summary generation fails
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "File uploaded successfully");
            response.put("file", uploadedFile);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            logger.error("Failed to upload file", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            logger.error("Unexpected error during file upload", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Upload multiple files
     */
    @PostMapping("/upload/multiple")
    public ResponseEntity<?> uploadMultipleFiles(@RequestParam("files") List<MultipartFile> files) {
        try {
            List<UploadedFile> uploadedFiles = fileStorageService.storeMultipleFiles(files);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", files.size() + " files uploaded successfully");
            response.put("files", uploadedFiles);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to upload files: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get all uploaded files
     */
    @GetMapping
    public ResponseEntity<List<UploadedFile>> getAllFiles() {
        List<UploadedFile> files = fileStorageService.getAllFiles();
        return ResponseEntity.ok(files);
    }
    
    /**
     * Get file by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getFileById(@PathVariable Long id) {
        try {
            UploadedFile file = fileStorageService.getFileById(id);
            return ResponseEntity.ok(file);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    
    /**
     * Delete file
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) {
        try {
            fileStorageService.deleteFile(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "File deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to delete file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get unprocessed files
     */
    @GetMapping("/unprocessed")
    public ResponseEntity<List<UploadedFile>> getUnprocessedFiles() {
        List<UploadedFile> files = fileStorageService.getUnprocessedFiles();
        return ResponseEntity.ok(files);
    }
    
    /**
     * Get recent files (last 7 days)
     */
    @GetMapping("/recent")
    public ResponseEntity<List<UploadedFile>> getRecentFiles() {
        List<UploadedFile> files = fileStorageService.getRecentFiles();
        return ResponseEntity.ok(files);
    }
    
    /**
     * Get file statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<FileStorageService.FileStats> getFileStatistics() {
        FileStorageService.FileStats stats = fileStorageService.getFileStatistics();
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Regenerate summary for a file
     */
    @PostMapping("/{id}/regenerate-summary")
    public ResponseEntity<?> regenerateSummary(@PathVariable Long id) {
        try {
            UploadedFile file = fileStorageService.getFileById(id);
            String summary = aiSummaryService.generateSummary(file);
            file = fileStorageService.updateFileSummary(id, summary);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Summary regenerated successfully");
            response.put("file", file);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
