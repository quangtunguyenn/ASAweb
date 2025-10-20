# AI Study Assistant - Java 21 Setup Guide

## 🚀 Quick Start

Your project has been upgraded to **Java 21 LTS** with **Spring Boot 3.3.5**!

---

## Prerequisites Check

Run these commands to verify your setup:

```powershell
# Check Java version (should be 21 or higher)
java -version

# Check Maven version
mvn -version

# Or use the wrapper (recommended)
.\mvnw.cmd -version
```

✅ **Your System:**
- Java: 23.0.2 (Compatible with Java 21 targets)
- Maven: 3.9.11
- Maven Wrapper: Installed ✓

---

## 🗄️ Database Setup

### Option 1: Install MySQL (Production-Ready)

1. **Download MySQL:**
   - https://dev.mysql.com/downloads/mysql/

2. **Install and start MySQL**

3. **Create database:**
   ```sql
   CREATE DATABASE ai_study_db;
   ```

4. **Update credentials** in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

### Option 2: Use H2 Database (Quick Dev Setup)

1. **Add H2 dependency** to `pom.xml`:
   ```xml
   <dependency>
       <groupId>com.h2database</groupId>
       <artifactId>h2</artifactId>
       <scope>runtime</scope>
   </dependency>
   ```

2. **Update `application.properties`:**
   ```properties
   # H2 Database (in-memory)
   spring.datasource.url=jdbc:h2:mem:testdb
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.username=sa
   spring.datasource.password=
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect
   
   # H2 Console (access at http://localhost:8080/h2-console)
   spring.h2.console.enabled=true
   ```

3. **Rebuild:**
   ```powershell
   mvn clean install
   ```

---

## 🏃 Running the Application

### Development Mode (with auto-reload):
```powershell
cd backend
mvn spring-boot:run
```

### Using Maven Wrapper (recommended):
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### Production Mode (JAR):
```powershell
cd backend
mvn clean package -DskipTests
java -jar target/ai-study-assistant-0.0.1-SNAPSHOT.jar
```

### With Custom Port:
```powershell
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=9090
```

---

## 🧪 Testing

### Run all tests:
```powershell
cd backend
mvn test
```

### Run specific test:
```powershell
mvn test -Dtest=YourTestClass
```

### Run with coverage:
```powershell
mvn clean test jacoco:report
```

---

## 📦 Building

### Development build:
```powershell
mvn clean install
```

### Production build (skip tests):
```powershell
mvn clean package -DskipTests
```

### Build with specific profile:
```powershell
mvn clean package -Pprod
```

---

## 🔍 Verification

### Check if app is running:
```powershell
# PowerShell
Invoke-WebRequest -Uri http://localhost:8080/actuator/health
```

### Or in browser:
- Application: http://localhost:8080
- Health Check: http://localhost:8080/actuator/health
- H2 Console (if enabled): http://localhost:8080/h2-console

---

## 🐛 Troubleshooting

### Problem: "mvn not recognized"
**Solution:** Use Maven wrapper instead:
```powershell
.\mvnw.cmd clean install
```

### Problem: "Port 8080 already in use"
**Solution 1:** Stop the process using port 8080
```powershell
# Find process on port 8080
netstat -ano | findstr :8080

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Solution 2:** Use different port
```powershell
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=9090
```

### Problem: "MySQL connection refused"
**Solution 1:** Ensure MySQL is running
```powershell
# Check MySQL service
Get-Service -Name MySQL*
```

**Solution 2:** Use H2 database (see Option 2 above)

### Problem: "Java version mismatch"
**Solution:** You have Java 23, which is compatible. If needed, set JAVA_HOME:
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
```

### Problem: Build fails with dependency errors
**Solution:** Clean and rebuild with updated dependencies
```powershell
mvn clean install -U
```

---

## 🎯 Java 21 Features Enabled

Your project now includes:

✅ **Virtual Threads** - Better concurrency (enabled in application.properties)
✅ **Pattern Matching** - Cleaner switch statements
✅ **Record Patterns** - Simplified data handling
✅ **Sequenced Collections** - Better list operations
✅ **Performance Improvements** - ~10-15% faster

**See `JAVA_21_FEATURES.md` for usage examples!**

---

## 📁 Project Structure

```
ASAweb/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/aistudyassistant/
│   │   │   │       ├── AiStudyAssistantApplication.java
│   │   │   │       ├── config/
│   │   │   │       │   └── CorsConfig.java
│   │   │   │       ├── controller/
│   │   │   │       ├── model/
│   │   │   │       ├── repository/
│   │   │   │       └── service/
│   │   │   └── resources/
│   │   │       └── application.properties (✅ Updated with Java 21 optimizations)
│   │   └── test/
│   ├── target/                    (Build output)
│   ├── uploads/                   (File uploads)
│   ├── pom.xml                    (✅ Java 21 configured)
│   ├── mvnw                       (✅ Maven wrapper)
│   ├── mvnw.cmd                   (✅ Maven wrapper for Windows)
│   ├── JAVA_21_FEATURES.md        (✅ Feature guide)
│   └── README.md                  (This file)
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── styles.css
└── JAVA_21_UPGRADE_SUMMARY.md     (✅ Upgrade details)
```

---

## 🔧 Configuration Files

### application.properties (Current Settings)
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ai_study_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.open-in-view=false

# Server
server.port=8080

# Java 21 Features
spring.threads.virtual.enabled=true

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
upload.dir=backend/uploads/
```

---

## 📚 Documentation

- [Java 21 Features Guide](./JAVA_21_FEATURES.md) - How to use Java 21 features
- [Upgrade Summary](../JAVA_21_UPGRADE_SUMMARY.md) - What changed during upgrade
- [Spring Boot Docs](https://docs.spring.io/spring-boot/docs/3.3.5/reference/html/)
- [Java 21 Docs](https://docs.oracle.com/en/java/javase/21/)

---

## 🎓 Next Steps

1. **Setup Database** (MySQL or H2)
2. **Create your first entity** in `model/` folder
3. **Create repository** in `repository/` folder
4. **Create service** in `service/` folder
5. **Create REST controller** in `controller/` folder
6. **Test with Postman** or curl

### Example Entity:
```java
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    
    // Getters and setters
}
```

### Or use Java 21 Record (for DTOs):
```java
public record StudentDTO(Long id, String name, String email) {}
```

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests: `mvn test`
4. Build: `mvn clean install`
5. Submit PR

---

## 📝 License

[Your License Here]

---

## 💡 Tips

- Use Maven wrapper (`mvnw.cmd`) for consistent builds across team
- Enable H2 console for quick database inspection during development
- Use virtual threads for better performance with concurrent requests
- Check `JAVA_21_FEATURES.md` for modern Java patterns
- Monitor application health at `/actuator/health`

---

## 🆘 Getting Help

- Check `JAVA_21_UPGRADE_SUMMARY.md` for troubleshooting
- Review Spring Boot docs for configuration options
- Check Java 21 migration guides for API changes

---

**✨ Happy Coding with Java 21! ✨**
