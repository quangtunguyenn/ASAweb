# 🎓 AI Study Assistant

An AI-powered study assistance platform that helps students manage their studies efficiently.

## 🎉 **NEW: Upgraded to Java 21 LTS!**

**Latest Update:** October 20, 2025  
✅ Java 21 LTS (from Java 17)  
✅ Spring Boot 3.3.5 (from 3.2.0)  
✅ Virtual Threads Enabled  
✅ Performance Optimizations Applied  

**� See [JAVA_21_UPGRADE_SUMMARY.md](./JAVA_21_UPGRADE_SUMMARY.md) for full details**

---

## �🚀 Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** Spring Boot 3.3.5 (Java 21 LTS) ⚡
- **Database:** MySQL 8.x
- **Build Tool:** Maven 3.9.11 + Maven Wrapper
- **New Features:** Virtual Threads, Pattern Matching, Record Patterns

## 📁 Project Structure

```
ASAweb/
├── backend/
│   ├── src/main/java/com/aistudyassistant/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── config/
│   │   └── AiStudyAssistantApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── uploads/
│   └── pom.xml
└── frontend/
    ├── index.html
    ├── styles.css
    └── app.js
```

## 🔧 Setup Instructions

### Prerequisites

- **Java 21 or higher** (Java 23 currently installed ✅)
- **Maven 3.6+** (Maven 3.9.11 installed ✅)
- **MySQL 8.0+** (or H2 for quick dev setup)
- Modern web browser

**🚀 Quick Start:** See [backend/README.md](./backend/README.md) for detailed setup guide!

### Backend Setup

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE ai_study_db;
   ```
   
   **Or use H2 for quick testing** (see [backend/README.md](./backend/README.md))

2. **Configure Database (if needed):**
   Edit `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=YOUR_USERNAME
   spring.datasource.password=YOUR_PASSWORD
   ```

3. **Run the Backend:**
   ```bash
   cd backend
   
   # Option 1: Using Maven
   mvn spring-boot:run
   
   # Option 2: Using Maven Wrapper (recommended)
   .\mvnw.cmd spring-boot:run
   ```
   
   Backend will start on `http://localhost:8080`
   
   **✨ Now with Java 21 Virtual Threads for better performance!**

### Frontend Setup

1. **Open Frontend:**
   Simply open `frontend/index.html` in your browser, or use a local server:
   
   ```bash
   cd frontend
   # Using Python
   python -m http.server 3000
   
   # Using Node.js (if you have http-server installed)
   npx http-server -p 3000
   ```
   
   Frontend will be available at `http://localhost:3000`

## 📋 Development Roadmap

### ✅ Phase 0 – Infrastructure Upgrade (COMPLETED) 🆕
- [x] Upgraded to Java 21 LTS
- [x] Updated Spring Boot to 3.3.5
- [x] Added Maven Wrapper
- [x] Enabled Virtual Threads
- [x] Optimized application configuration
- [x] Created comprehensive documentation

### ✅ Phase 1 – Project Initialization (COMPLETED)
- [x] Spring Boot project structure
- [x] MySQL database configuration
- [x] Frontend basic layout with 5 modules
- [x] CORS configuration

### 🚧 Phase 2 – Module A: AI Study Engine
- [ ] File upload functionality
- [ ] File metadata storage
- [ ] Summary generation (mock)

### 📅 Phase 3 – Module B: AI Chat & Q&A
- [ ] Chat endpoint
- [ ] Chat UI
- [ ] AI integration preparation

### 📅 Phase 4 – Module C: Study Management Dashboard
- [ ] Subject management
- [ ] Exam tracking
- [ ] Assignment management
- [ ] Note-taking

### 📅 Phase 5 – Module D: Productivity Tools
- [ ] Pomodoro timer
- [ ] Exam countdown
- [ ] Whiteboard notes
- [ ] Study statistics

### 📅 Phase 6 – Module E: AI Study Coach
- [ ] Study recommendations
- [ ] Performance analytics

### 📅 Phase 7 – Cloud Sync & Export
- [ ] Cloud storage integration
- [ ] PDF export
- [ ] Quiz generation

### 📅 Phase 8 – Commercialization (Optional)
- [ ] User authentication
- [ ] Pricing plans
- [ ] Payment integration

## 🎯 Features

- **📚 Upload & Summarize:** Upload lecture files and get AI-generated summaries
- **💬 AI Chat & Q&A:** Ask questions about study material
- **📊 Study Dashboard:** Manage subjects, exams, and assignments
- **⏱️ Productivity Tools:** Pomodoro timer, countdown, and statistics
- **🎯 AI Study Coach:** Personalized study recommendations
- **⚡ Java 21 Performance:** Virtual threads for better concurrency and responsiveness

---

## 📚 Documentation

- **[JAVA_21_UPGRADE_SUMMARY.md](./JAVA_21_UPGRADE_SUMMARY.md)** - Complete upgrade details
- **[backend/README.md](./backend/README.md)** - Quick start guide
- **[backend/JAVA_21_FEATURES.md](./backend/JAVA_21_FEATURES.md)** - Java 21 features guide
- **[DEVELOPER_CHECKLIST.md](./DEVELOPER_CHECKLIST.md)** - Development checklist

---

This is a learning project. Feel free to fork and experiment!

## 📄 License

MIT License - feel free to use for educational purposes.

---

**Built with ❤️ for students by students**
