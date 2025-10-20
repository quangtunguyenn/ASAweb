# Java 21 Features - Quick Reference Guide

## 🚀 How to Use Java 21 Features in Your AI Study Assistant Project

---

## 1. Virtual Threads (Project Loom) - Game Changer for Web Apps

### What it does:
Handle thousands of concurrent requests with minimal overhead.

### Use in your project:

#### Enable in Spring Boot (application.properties):
```properties
spring.threads.virtual.enabled=true
```

#### Example: Async AI Processing
```java
@Service
public class AIProcessingService {
    
    // Process multiple student queries concurrently
    public List<String> processStudentQueries(List<String> queries) {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Future<String>> futures = queries.stream()
                .map(query -> executor.submit(() -> processWithAI(query)))
                .toList();
            
            return futures.stream()
                .map(f -> {
                    try { return f.get(); }
                    catch (Exception e) { return "Error"; }
                })
                .toList();
        }
    }
    
    private String processWithAI(String query) {
        // Your AI processing logic
        return "Processed: " + query;
    }
}
```

---

## 2. Pattern Matching for Switch

### Use in Controllers and Services:

```java
@RestController
@RequestMapping("/api/study-material")
public class StudyMaterialController {
    
    @PostMapping("/process")
    public ResponseEntity<String> processMaterial(@RequestBody Object material) {
        String result = switch (material) {
            case Document doc -> processDocument(doc);
            case Video video -> processVideo(video);
            case Quiz quiz -> processQuiz(quiz);
            case null -> "No material provided";
            default -> "Unknown material type";
        };
        
        return ResponseEntity.ok(result);
    }
}
```

---

## 3. Record Patterns - Perfect for DTOs

### Define your DTOs as records:

```java
// Request/Response DTOs
public record StudentRequest(String name, String email, Integer grade) {}

public record StudySessionRequest(
    String studentId,
    String subject,
    Integer duration,
    List<String> topics
) {}

public record AIResponseDTO(
    String answer,
    Double confidence,
    List<String> sources
) {}

// Use with pattern matching
@PostMapping("/session")
public ResponseEntity<String> createSession(@RequestBody Object request) {
    return switch (request) {
        case StudySessionRequest(String id, String subj, Integer dur, var topics) 
            when dur > 0 -> {
            // Create session
            yield ResponseEntity.ok("Session created for " + subj);
        }
        case null -> ResponseEntity.badRequest().body("Invalid request");
        default -> ResponseEntity.badRequest().body("Unknown request type");
    };
}
```

---

## 4. Sequenced Collections - Better List Operations

### Use in your repositories and services:

```java
@Service
public class StudyHistoryService {
    
    private List<StudySession> sessions = new ArrayList<>();
    
    // Add latest session at the beginning
    public void addSession(StudySession session) {
        sessions.addFirst(session);  // Java 21 feature!
    }
    
    // Get most recent session
    public StudySession getLatestSession() {
        return sessions.getFirst();  // Java 21 feature!
    }
    
    // Get oldest session
    public StudySession getOldestSession() {
        return sessions.getLast();  // Java 21 feature!
    }
    
    // Reverse order for displaying
    public List<StudySession> getReversedHistory() {
        return sessions.reversed();  // Java 21 feature!
    }
}
```

---

## 5. Enhanced Null Handling

### Use in your services:

```java
@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    public Student findStudent(String id) {
        // Old way
        // return studentRepository.findById(id).orElse(null);
        
        // Java 21 way - cleaner
        return studentRepository.findById(id)
            .orElseThrow(() -> new StudentNotFoundException(id));
    }
    
    // Pattern matching with null checks
    public String getStudentInfo(Student student) {
        return switch (student) {
            case null -> "Student not found";
            case Student s when s.isActive() -> "Active: " + s.getName();
            case Student s -> "Inactive: " + s.getName();
        };
    }
}
```

---

## 6. Improved Stream Operations

### Use for data processing:

```java
@Service
public class AnalyticsService {
    
    // Process study statistics with better performance
    public Map<String, Double> calculateAverageScores(List<StudySession> sessions) {
        return sessions.stream()
            .collect(Collectors.groupingBy(
                StudySession::getSubject,
                Collectors.averagingInt(StudySession::getScore)
            ));
    }
    
    // Find top performing students
    public List<Student> getTopStudents(List<Student> students, int limit) {
        return students.stream()
            .sorted(Comparator.comparingDouble(Student::getAverageScore).reversed())
            .limit(limit)
            .toList();  // Java 21 - returns immutable list
    }
}
```

---

## 7. CompletableFuture Enhancements

### Use for async AI operations:

```java
@Service
public class AIService {
    
    // Process multiple AI requests concurrently
    public CompletableFuture<AIResponse> getAIAssistance(String query) {
        return CompletableFuture.supplyAsync(() -> {
            // Call AI API
            return processAIQuery(query);
        }, Executors.newVirtualThreadPerTaskExecutor());
    }
    
    // Combine multiple AI responses
    public CompletableFuture<String> getCombinedResponse(String query) {
        CompletableFuture<String> grammar = getGrammarCheck(query);
        CompletableFuture<String> summary = getSummary(query);
        CompletableFuture<String> suggestions = getSuggestions(query);
        
        return CompletableFuture.allOf(grammar, summary, suggestions)
            .thenApply(v -> {
                return "Grammar: " + grammar.join() + "\n" +
                       "Summary: " + summary.join() + "\n" +
                       "Suggestions: " + suggestions.join();
            });
    }
}
```

---

## 8. Better Exception Handling

### Use in your exception handlers:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        // Java 21 pattern matching in catch
        return switch (ex) {
            case StudentNotFoundException snfe -> 
                ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Student not found", snfe.getMessage()));
            
            case InvalidDataException ide ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Invalid data", ide.getMessage()));
            
            case AIServiceException aise ->
                ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new ErrorResponse("AI service error", aise.getMessage()));
            
            default ->
                ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Internal error", ex.getMessage()));
        };
    }
}

record ErrorResponse(String error, String message) {}
```

---

## 9. Performance Monitoring with Java 21

### Add to your application:

```java
@Configuration
public class PerformanceConfig {
    
    @Bean
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        
        // Use virtual threads for better scalability
        executor.setThreadFactory(Thread.ofVirtual().factory());
        executor.setTaskDecorator(runnable -> () -> {
            long start = System.currentTimeMillis();
            try {
                runnable.run();
            } finally {
                long duration = System.currentTimeMillis() - start;
                if (duration > 1000) {
                    System.out.println("Slow task detected: " + duration + "ms");
                }
            }
        });
        
        return executor;
    }
}
```

---

## 10. File Processing with Better Performance

### Use for file uploads:

```java
@Service
public class FileProcessingService {
    
    @Value("${upload.dir}")
    private String uploadDir;
    
    // Process uploaded files with virtual threads
    public List<ProcessedFile> processFiles(List<MultipartFile> files) {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Future<ProcessedFile>> futures = files.stream()
                .map(file -> executor.submit(() -> processFile(file)))
                .toList();
            
            return futures.stream()
                .map(f -> {
                    try { return f.get(); }
                    catch (Exception e) { return new ProcessedFile(null, "Error"); }
                })
                .toList();
        }
    }
    
    private ProcessedFile processFile(MultipartFile file) throws IOException {
        Path path = Paths.get(uploadDir, file.getOriginalFilename());
        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        
        return new ProcessedFile(
            path.toString(),
            "Processed successfully"
        );
    }
}

record ProcessedFile(String path, String status) {}
```

---

## Quick Migration Checklist

### ✅ Easy Wins (Do These First):

1. **Enable Virtual Threads**
   ```properties
   spring.threads.virtual.enabled=true
   ```

2. **Convert DTOs to Records**
   ```java
   public record StudentDTO(String name, String email) {}
   ```

3. **Use Sequenced Collections**
   ```java
   list.addFirst(item);  // Instead of list.add(0, item)
   list.getFirst();      // Instead of list.get(0)
   ```

4. **Pattern Matching in Switch**
   ```java
   switch (object) {
       case String s -> handleString(s);
       case Integer i -> handleInt(i);
       default -> handleOther();
   }
   ```

### 🚀 Advanced Features (Implement Gradually):

5. **Virtual Thread Executors** for concurrent processing
6. **Record Patterns** for complex data extraction
7. **CompletableFuture** with virtual threads for async operations
8. **Enhanced Stream APIs** for data processing

---

## Performance Tips

### 1. Virtual Threads Work Best For:
- I/O operations (database, API calls)
- File processing
- Network requests
- Blocking operations

### 2. Don't Use Virtual Threads For:
- CPU-intensive tasks (use regular threads)
- Very short-lived operations
- Operations that already use async/reactive patterns

### 3. Monitor Performance:
```java
// Add to application.properties
management.endpoints.web.exposure.include=health,metrics,threaddump
management.metrics.enable.jvm=true
```

---

## Common Patterns in Spring Boot with Java 21

### Async Controller with Virtual Threads:
```java
@RestController
@RequestMapping("/api/async")
public class AsyncController {
    
    @GetMapping("/process")
    public CompletableFuture<ResponseEntity<String>> processAsync(@RequestParam String data) {
        return CompletableFuture.supplyAsync(() -> {
            // Heavy processing
            String result = heavyProcessing(data);
            return ResponseEntity.ok(result);
        }, Executors.newVirtualThreadPerTaskExecutor());
    }
}
```

---

## Resources & Further Reading

- [JEP 444: Virtual Threads](https://openjdk.org/jeps/444)
- [JEP 441: Pattern Matching for switch](https://openjdk.org/jeps/441)
- [JEP 440: Record Patterns](https://openjdk.org/jeps/440)
- [JEP 431: Sequenced Collections](https://openjdk.org/jeps/431)

---

**Remember:** Java 21 is backward compatible, so your existing code will work fine. Adopt these features gradually to improve performance and code readability!
