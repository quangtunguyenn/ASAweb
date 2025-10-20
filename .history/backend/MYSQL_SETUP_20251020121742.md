# MySQL Setup Instructions

## 🗄️ MySQL Database Configuration

### Step 1: Start MySQL Service

**Option A: Using Windows Services**
1. Press `Win + R`, type `services.msc`, press Enter
2. Find "MySQL80" or "MySQL" service
3. Right-click → Start (if not running)

**Option B: Using Command Line (as Administrator)**
```powershell
net start MySQL80
```

### Step 2: Create Database

**Option A: Using MySQL Workbench (Recommended)**
1. Open MySQL Workbench
2. Connect to localhost (default connection)
3. Open the SQL script: `backend/setup-database.sql`
4. Execute the script (click the lightning bolt icon)

**Option B: Using MySQL Command Line**
```powershell
# Login to MySQL (enter your password when prompted)
mysql -u root -p

# Then run these commands:
CREATE DATABASE ai_study_db;
USE ai_study_db;
SHOW DATABASES;
EXIT;
```

**Option C: Run the SQL file directly**
```powershell
mysql -u root -p < backend/setup-database.sql
```

### Step 3: Update Application Configuration

Check `backend/src/main/resources/application.properties`:

```properties
# If you set a password during MySQL installation, update this:
spring.datasource.password=YOUR_MYSQL_PASSWORD

# If using a different username:
spring.datasource.username=YOUR_USERNAME
```

### Step 4: Verify Connection

Run your Spring Boot application:
```powershell
cd e:\ASAweb\backend
.\mvnw.cmd spring-boot:run
```

**Expected output:**
```
Started AiStudyAssistantApplication in X.XXX seconds
Tomcat started on port 8080 (http)
```

**✅ If you see these messages, MySQL is connected successfully!**

---

## 🔍 Troubleshooting

### Problem: "Access denied for user 'root'@'localhost'"
**Solution:** Update the password in `application.properties`
```properties
spring.datasource.password=your_actual_mysql_password
```

### Problem: "MySQL service won't start"
**Solution 1:** Restart the service
```powershell
net stop MySQL80
net start MySQL80
```

**Solution 2:** Check if port 3306 is in use
```powershell
netstat -ano | findstr :3306
```

### Problem: "Unknown database 'ai_study_db'"
**Solution:** Create the database manually
```sql
CREATE DATABASE ai_study_db;
```

### Problem: "Communications link failure"
**Solution:** Ensure MySQL is running
```powershell
# Check MySQL service status
Get-Service -Name MySQL*
```

---

## 📊 Verify Database Tables

After starting your Spring Boot application, check if tables were created:

```sql
USE ai_study_db;
SHOW TABLES;
DESCRIBE your_table_name;
```

Spring Boot will automatically create tables based on your JPA entities when the application starts.

---

## 🎯 Quick Test

Once the application is running, test the connection:

**1. Check application health:**
```powershell
curl http://localhost:8080/actuator/health
```

**2. Check in MySQL:**
```sql
USE ai_study_db;
SHOW TABLES;
```

You should see tables created by Hibernate based on your entities.

---

## 💡 Tips

1. **Keep MySQL Workbench open** - Easy to monitor database changes
2. **Check application logs** - They show all SQL queries when `spring.jpa.show-sql=true`
3. **Auto-create database** - Your config has `?createDatabaseIfNotExist=true`, so database will be created automatically if it doesn't exist
4. **DevTools enabled** - Application will auto-restart when you make code changes

---

## 🚀 Next Steps

After MySQL is connected:

1. ✅ Create your first Entity (e.g., `Student`, `Subject`, `StudySession`)
2. ✅ Create Repository interface
3. ✅ Create Service class
4. ✅ Create REST Controller
5. ✅ Test with Postman or curl

---

## 📝 Example Entity to Get Started

Create this file: `backend/src/main/java/com/aistudyassistant/model/Student.java`

```java
package com.aistudyassistant.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
public class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private String grade;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public Student() {}
    
    public Student(String name, String email) {
        this.name = name;
        this.email = email;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
}
```

When you restart the application, you'll see a `students` table automatically created in your database!

---

**Need help? Check the main documentation files for more examples and troubleshooting tips!**
