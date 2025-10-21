package com.aistudyassistant.service;

import com.aistudyassistant.model.*;
import com.aistudyassistant.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Main service for AI Study Engine
 * Handles document upload, processing, and AI generation
 */
@Service
public class StudyEngineService {
    
    private static final Logger logger = LoggerFactory.getLogger(StudyEngineService.class);
    
    @Autowired
    private StudyDocumentRepository documentRepository;
    
    @Autowired
    private QuizRepository quizRepository;
    
    @Autowired
    private QuizQuestionRepository quizQuestionRepository;
    
    @Autowired
    private FlashcardRepository flashcardRepository;
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    @Autowired
    private AIProcessingService aiProcessingService;
    
    @Autowired
    private PDFService pdfService;
    
    @Value("${upload.dir}")
    private String uploadDir;
    
    /**
     * Upload and process document
     */
    @Transactional
    public StudyDocument uploadDocument(MultipartFile file, User user, String title, String description) throws IOException {
        logger.info("Starting document upload for user: {}, file: {}", user.getEmail(), file.getOriginalFilename());
        
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }
        
        // Create upload directory if not exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        String storedFileName = UUID.randomUUID().toString() + fileExtension;
        
        // Store file
        Path targetLocation = uploadPath.resolve(storedFileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        logger.info("File stored at: {}", targetLocation);
        
        // Create document entity
        StudyDocument document = new StudyDocument();
        document.setUser(user);
        document.setTitle(title != null && !title.isBlank() ? title : originalFileName);
        document.setDescription(description);
        document.setOriginalFileName(originalFileName);
        document.setStoredFileName(storedFileName);
        document.setFilePath(targetLocation.toString());
        document.setFileType(fileExtension.replace(".", ""));
        document.setFileSize(file.getSize());
        document.setStatus(StudyDocument.ProcessingStatus.PENDING);
        
        document = documentRepository.save(document);
        logger.info("Document created with ID: {}", document.getId());
        
        // Start async processing
        processDocumentAsync(document);
        
        return document;
    }
    
    /**
     * Process document asynchronously
     * Extract text → Generate summary → Generate quiz → Generate flashcards → Generate mindmap
     */
    private void processDocumentAsync(StudyDocument document) {
        new Thread(() -> {
            try {
                logger.info("Starting async processing for document ID: {}", document.getId());
                
                // Step 1: Extract text
                updateDocumentStatus(document.getId(), StudyDocument.ProcessingStatus.EXTRACTING_TEXT, 10);
                String extractedText = aiProcessingService.extractText(document.getFilePath(), document.getFileType());
                document.setExtractedText(extractedText);
                documentRepository.save(document);
                logger.info("Text extracted successfully, length: {}", extractedText.length());
                
                // Step 2: Generate summary
                updateDocumentStatus(document.getId(), StudyDocument.ProcessingStatus.GENERATING_SUMMARY, 30);
                String summary = aiProcessingService.generateSummary(extractedText);
                String keyPoints = aiProcessingService.generateKeyPoints(extractedText);
                document.setSummary(summary);
                document.setKeyPoints(keyPoints);
                documentRepository.save(document);
                logger.info("Summary and key points generated");
                
                // Step 3: Generate quiz
                updateDocumentStatus(document.getId(), StudyDocument.ProcessingStatus.GENERATING_QUIZ, 50);
                generateQuiz(document, extractedText);
                logger.info("Quiz generated");
                
                // Step 4: Generate flashcards
                updateDocumentStatus(document.getId(), StudyDocument.ProcessingStatus.GENERATING_FLASHCARDS, 70);
                generateFlashcards(document, extractedText);
                logger.info("Flashcards generated");
                
                // Step 5: Generate mindmap
                updateDocumentStatus(document.getId(), StudyDocument.ProcessingStatus.GENERATING_MINDMAP, 90);
                String mindmapUrl = aiProcessingService.generateMindmap(document, extractedText);
                document.setMindmapUrl(mindmapUrl);
                documentRepository.save(document);
                logger.info("Mindmap generated");
                
                // Step 6: Generate summary PDF
                String summaryPdfUrl = pdfService.generateSummaryPDF(document);
                document.setSummaryPdfUrl(summaryPdfUrl);
                documentRepository.save(document);
                logger.info("Summary PDF generated");
                
                // Complete
                updateDocumentStatus(document.getId(), StudyDocument.ProcessingStatus.COMPLETED, 100);
                logger.info("Document processing completed successfully for ID: {}", document.getId());
                
            } catch (Exception e) {
                logger.error("Error processing document ID: " + document.getId(), e);
                updateDocumentStatusWithError(document.getId(), StudyDocument.ProcessingStatus.FAILED, e.getMessage());
            }
        }).start();
    }
    
    /**
     * Generate quiz from document
     */
    private void generateQuiz(StudyDocument document, String extractedText) {
        List<QuizQuestion> questions = aiProcessingService.generateQuizQuestions(extractedText, 10);
        
        Quiz quiz = new Quiz();
        quiz.setDocument(document);
        quiz.setTitle("Quiz: " + document.getTitle());
        quiz.setDescription("AI-generated quiz from document content");
        quiz.setDifficulty(Quiz.DifficultyLevel.MEDIUM);
        quiz.setTotalQuestions(questions.size());
        quiz = quizRepository.save(quiz);
        
        // Save questions
        for (int i = 0; i < questions.size(); i++) {
            QuizQuestion question = questions.get(i);
            question.setQuiz(quiz);
            question.setOrderIndex(i + 1);
            quizQuestionRepository.save(question);
        }
    }
    
    /**
     * Generate flashcards from document
     */
    private void generateFlashcards(StudyDocument document, String extractedText) {
        List<Flashcard> flashcards = aiProcessingService.generateFlashcards(extractedText, 15);
        
        for (int i = 0; i < flashcards.size(); i++) {
            Flashcard flashcard = flashcards.get(i);
            flashcard.setDocument(document);
            flashcard.setOrderIndex(i + 1);
            flashcardRepository.save(flashcard);
        }
    }
    
    /**
     * Chat with AI based on document context
     */
    @Transactional
    public ChatMessage chat(Long documentId, User user, String message) {
        StudyDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        // Save user message
        ChatMessage userMessage = new ChatMessage(document, user, ChatMessage.MessageRole.USER, message);
        chatMessageRepository.save(userMessage);
        
        // Get chat history
        List<ChatMessage> history = chatMessageRepository.findByDocumentAndUserOrderByCreatedAtAsc(document, user);
        
        // Generate AI response
        String aiResponse = aiProcessingService.generateChatResponse(document, history, message);
        
        // Save AI message
        ChatMessage aiMessage = new ChatMessage(document, user, ChatMessage.MessageRole.ASSISTANT, aiResponse);
        chatMessageRepository.save(aiMessage);
        
        return aiMessage;
    }
    
    /**
     * Get all documents for user
     */
    public List<StudyDocument> getUserDocuments(User user) {
        return documentRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    /**
     * Get document by ID
     */
    public StudyDocument getDocument(Long id, User user) {
        StudyDocument document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        if (!document.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        document.incrementViewCount();
        documentRepository.save(document);
        
        return document;
    }
    
    /**
     * Get quizzes for document
     */
    public List<Quiz> getDocumentQuizzes(Long documentId) {
        StudyDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        return quizRepository.findByDocumentOrderByCreatedAtDesc(document);
    }
    
    /**
     * Get flashcards for document
     */
    public List<Flashcard> getDocumentFlashcards(Long documentId) {
        StudyDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        return flashcardRepository.findByDocumentOrderByOrderIndexAsc(document);
    }
    
    /**
     * Get chat history for document
     */
    public List<ChatMessage> getChatHistory(Long documentId, User user) {
        StudyDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        return chatMessageRepository.findByDocumentAndUserOrderByCreatedAtAsc(document, user);
    }
    
    /**
     * Delete document and all related data
     */
    @Transactional
    public void deleteDocument(Long id, User user) throws IOException {
        StudyDocument document = getDocument(id, user);
        
        // Delete physical file
        Path filePath = Paths.get(document.getFilePath());
        Files.deleteIfExists(filePath);
        
        // Delete from database (cascade will handle related entities)
        documentRepository.delete(document);
    }
    
    /**
     * Regenerate specific learning material
     */
    public void regenerateQuiz(Long documentId) {
        StudyDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        // Delete existing quizzes
        List<Quiz> existingQuizzes = quizRepository.findByDocumentOrderByCreatedAtDesc(document);
        quizRepository.deleteAll(existingQuizzes);
        
        // Generate new quiz
        generateQuiz(document, document.getExtractedText());
    }
    
    public void regenerateFlashcards(Long documentId) {
        StudyDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        // Delete existing flashcards
        List<Flashcard> existing = flashcardRepository.findByDocumentOrderByOrderIndexAsc(document);
        flashcardRepository.deleteAll(existing);
        
        // Generate new flashcards
        generateFlashcards(document, document.getExtractedText());
    }
    
    // Helper methods
    private void updateDocumentStatus(Long documentId, StudyDocument.ProcessingStatus status, Integer progress) {
        documentRepository.findById(documentId).ifPresent(doc -> {
            doc.setStatus(status);
            doc.setProcessingProgress(progress);
            documentRepository.save(doc);
        });
    }
    
    private void updateDocumentStatusWithError(Long documentId, StudyDocument.ProcessingStatus status, String error) {
        documentRepository.findById(documentId).ifPresent(doc -> {
            doc.setStatus(status);
            doc.setProcessingError(error);
            documentRepository.save(doc);
        });
    }
    
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }
}
