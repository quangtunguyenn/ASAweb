package com.aistudyassistant.service;

import com.aistudyassistant.model.UploadedFile;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * AI Summary Service - Mock implementation for Phase 2
 * This will be replaced with actual AI integration in later phases
 */
@Service
public class AISummaryService {
    
    /**
     * Generate summary for uploaded file (Mock implementation)
     * In production, this would call OpenAI, Claude, or custom AI model
     */
    public String generateSummary(UploadedFile file) {
        try {
            // Read file content (simplified for demo)
            String content = readFileContent(file.getFilePath());
            
            // Mock AI summary generation
            return generateMockSummary(file.getOriginalFileName(), content);
            
        } catch (IOException e) {
            return "Error generating summary: " + e.getMessage();
        }
    }
    
    /**
     * Read file content
     */
    private String readFileContent(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        
        // For text files, read content directly
        if (isTextFile(filePath)) {
            return Files.readString(path);
        }
        
        // For other file types, return metadata
        return "Binary file: " + path.getFileName();
    }
    
    /**
     * Check if file is text file
     */
    private boolean isTextFile(String filePath) {
        String lower = filePath.toLowerCase();
        return lower.endsWith(".txt") || 
               lower.endsWith(".md") || 
               lower.endsWith(".java") ||
               lower.endsWith(".js") ||
               lower.endsWith(".html") ||
               lower.endsWith(".css") ||
               lower.endsWith(".xml") ||
               lower.endsWith(".json");
    }
    
    /**
     * Generate mock summary
     */
    private String generateMockSummary(String fileName, String content) {
        // Simple mock summary based on content length
        int wordCount = content.split("\\s+").length;
        int lineCount = content.split("\n").length;
        
        return String.format(
            "📄 Summary of '%s':\n\n" +
            "📊 Statistics:\n" +
            "- Total words: %d\n" +
            "- Total lines: %d\n" +
            "- File type: %s\n\n" +
            "📝 Preview:\n%s\n\n" +
            "💡 This is a mock summary. " +
            "AI integration will be added in Phase 3 for intelligent content analysis.",
            fileName,
            wordCount,
            lineCount,
            getFileType(fileName),
            getPreview(content, 200)
        );
    }
    
    /**
     * Get file type from extension
     */
    private String getFileType(String fileName) {
        if (fileName.endsWith(".txt")) return "Text Document";
        if (fileName.endsWith(".pdf")) return "PDF Document";
        if (fileName.endsWith(".docx")) return "Word Document";
        if (fileName.endsWith(".java")) return "Java Source Code";
        if (fileName.endsWith(".md")) return "Markdown Document";
        return "Unknown";
    }
    
    /**
     * Get content preview
     */
    private String getPreview(String content, int maxLength) {
        if (content.length() <= maxLength) {
            return content;
        }
        return content.substring(0, maxLength) + "...";
    }
    
    /**
     * Generate study tips from content (Mock)
     */
    public String generateStudyTips(String content) {
        return """
            📚 Study Tips:
            
            1. Break down the content into smaller sections
            2. Create flashcards for key concepts
            3. Practice with examples
            4. Review regularly using spaced repetition
            5. Test yourself on the material
            
            💡 These are generic tips. AI-powered personalized recommendations coming in Phase 5!
            """;
    }
}
