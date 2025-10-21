package com.aistudyassistant.controller;

import com.aistudyassistant.model.*;
import com.aistudyassistant.service.StudyEngineService;
import com.aistudyassistant.service.JwtService;
import com.aistudyassistant.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Main controller for AI Study Engine
 * Handles all study-related endpoints
 */
@RestController
@RequestMapping("/api/study")
@CrossOrigin(origins = "*")
public class StudyEngineController {
    
    private static final Logger logger = LoggerFactory.getLogger(StudyEngineController.class);
    
    @Autowired
    private StudyEngineService studyEngineService;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Upload document for processing
     * POST /api/study/upload
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description) {
        
        logger.info("Upload request received: {}", file.getOriginalFilename());
        
        try {
            User user = getCurrentUser();
            
            StudyDocument document = studyEngineService.uploadDocument(file, user, title, description);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Document uploaded successfully");
            response.put("document", document);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            logger.error("File upload error", e);
            return createErrorResponse("Failed to upload file: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            logger.error("Unexpected error", e);
            return createErrorResponse("Unexpected error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get all user documents
     * GET /api/study/documents
     */
    @GetMapping("/documents")
    public ResponseEntity<?> getDocuments() {
        try {
            User user = getCurrentUser();
            List<StudyDocument> documents = studyEngineService.getUserDocuments(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("documents", documents);
            response.put("total", documents.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching documents", e);
            return createErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get single document by ID
     * GET /api/study/documents/{id}
     */
    @GetMapping("/documents/{id}")
    public ResponseEntity<?> getDocument(@PathVariable Long id) {
        try {
            User user = getCurrentUser();
            StudyDocument document = studyEngineService.getDocument(id, user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("document", document);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            logger.error("Document not found: {}", id);
            return createErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Error fetching document", e);
            return createErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Delete document
     * DELETE /api/study/documents/{id}
     */
    @DeleteMapping("/documents/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        try {
            User user = getCurrentUser();
            studyEngineService.deleteDocument(id, user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Document deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            logger.error("Error deleting document", e);
            return createErrorResponse("Failed to delete document: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get quizzes for document
     * GET /api/study/documents/{id}/quizzes
     */
    @GetMapping("/documents/{id}/quizzes")
    public ResponseEntity<?> getQuizzes(@PathVariable Long id) {
        try {
            List<Quiz> quizzes = studyEngineService.getDocumentQuizzes(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("quizzes", quizzes);
            response.put("total", quizzes.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching quizzes", e);
            return createErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * Get flashcards for document
     * GET /api/study/documents/{id}/flashcards
     */
    @GetMapping("/documents/{id}/flashcards")
    public ResponseEntity<?> getFlashcards(@PathVariable Long id) {
        try {
            List<Flashcard> flashcards = studyEngineService.getDocumentFlashcards(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("flashcards", flashcards);
            response.put("total", flashcards.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching flashcards", e);
            return createErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * Chat with AI about document
     * POST /api/study/documents/{id}/chat
     */
    @PostMapping("/documents/{id}/chat")
    public ResponseEntity<?> chat(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        try {
            User user = getCurrentUser();
            String message = request.get("message");
            
            if (message == null || message.trim().isEmpty()) {
                return createErrorResponse("Message is required", HttpStatus.BAD_REQUEST);
            }
            
            ChatMessage response = studyEngineService.chat(id, user, message);
            
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("success", true);
            responseMap.put("message", response);
            
            return ResponseEntity.ok(responseMap);
            
        } catch (Exception e) {
            logger.error("Error in chat", e);
            return createErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get chat history for document
     * GET /api/study/documents/{id}/chat/history
     */
    @GetMapping("/documents/{id}/chat/history")
    public ResponseEntity<?> getChatHistory(@PathVariable Long id) {
        try {
            User user = getCurrentUser();
            List<ChatMessage> history = studyEngineService.getChatHistory(id, user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("history", history);
            response.put("total", history.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching chat history", e);
            return createErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * Regenerate quiz for document
     * POST /api/study/documents/{id}/regenerate/quiz
     */
    @PostMapping("/documents/{id}/regenerate/quiz")
    public ResponseEntity<?> regenerateQuiz(@PathVariable Long id) {
        try {
            studyEngineService.regenerateQuiz(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Quiz regeneration started");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error regenerating quiz", e);
            return createErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Regenerate flashcards for document
     * POST /api/study/documents/{id}/regenerate/flashcards
     */
    @PostMapping("/documents/{id}/regenerate/flashcards")
    public ResponseEntity<?> regenerateFlashcards(@PathVariable Long id) {
        try {
            studyEngineService.regenerateFlashcards(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Flashcards regeneration started");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error regenerating flashcards", e);
            return createErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Helper methods
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    private ResponseEntity<?> createErrorResponse(String message, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return ResponseEntity.status(status).body(response);
    }
}
