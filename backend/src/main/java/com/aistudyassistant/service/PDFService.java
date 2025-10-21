package com.aistudyassistant.service;

import com.aistudyassistant.model.StudyDocument;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * PDF Generation Service
 * Generates summary PDFs from study documents
 */
@Service
public class PDFService {
    
    private static final Logger logger = LoggerFactory.getLogger(PDFService.class);
    
    @Value("${upload.dir}")
    private String uploadDir;
    
    /**
     * Generate a summary PDF from study document
     */
    public String generateSummaryPDF(StudyDocument document) throws IOException {
        logger.info("Generating summary PDF for document: {}", document.getId());
        
        String pdfFileName = "summary_" + document.getId() + ".pdf";
        Path pdfPath = Paths.get(uploadDir, pdfFileName);
        
        try (PDDocument pdf = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            pdf.addPage(page);
            
            try (PDPageContentStream contentStream = new PDPageContentStream(pdf, page)) {
                float margin = 50;
                float yPosition = page.getMediaBox().getHeight() - margin;
                float fontSize = 12;
                float leading = 1.5f * fontSize;
                
                // Title
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 18);
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText(document.getTitle());
                contentStream.endText();
                
                yPosition -= 30;
                
                // Summary section
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 14);
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText("Summary");
                contentStream.endText();
                
                yPosition -= 20;
                
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), fontSize);
                contentStream.newLineAtOffset(margin, yPosition);
                
                // Write summary with word wrapping
                String summary = document.getSummary() != null ? document.getSummary() : "No summary available";
                String[] words = summary.split(" ");
                StringBuilder line = new StringBuilder();
                float maxWidth = page.getMediaBox().getWidth() - 2 * margin;
                
                for (String word : words) {
                    String testLine = line + (line.length() > 0 ? " " : "") + word;
                    float width = new PDType1Font(Standard14Fonts.FontName.HELVETICA).getStringWidth(testLine) / 1000 * fontSize;
                    
                    if (width > maxWidth) {
                        contentStream.showText(line.toString());
                        contentStream.newLineAtOffset(0, -leading);
                        yPosition -= leading;
                        line = new StringBuilder(word);
                    } else {
                        line.append(line.length() > 0 ? " " : "").append(word);
                    }
                }
                
                if (line.length() > 0) {
                    contentStream.showText(line.toString());
                }
                
                contentStream.endText();
                
                yPosition -= 40;
                
                // Key Points section
                if (document.getKeyPoints() != null) {
                    contentStream.beginText();
                    contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 14);
                    contentStream.newLineAtOffset(margin, yPosition);
                    contentStream.showText("Key Points");
                    contentStream.endText();
                    
                    yPosition -= 20;
                    
                    contentStream.beginText();
                    contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), fontSize);
                    contentStream.newLineAtOffset(margin, yPosition);
                    
                    String[] keyPoints = document.getKeyPoints().split("\n");
                    for (String point : keyPoints) {
                        contentStream.showText(point);
                        contentStream.newLineAtOffset(0, -leading);
                        yPosition -= leading;
                    }
                    
                    contentStream.endText();
                }
            }
            
            pdf.save(pdfPath.toFile());
        }
        
        logger.info("Summary PDF generated: {}", pdfPath);
        return "/api/documents/" + document.getId() + "/summary-pdf";
    }
}
