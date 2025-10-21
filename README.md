# 🎓 AI Study Assistant# 🎓 AI Study Assistant



An AI-powered study assistance platform that helps students manage their studies efficiently with modern design and seamless user experience.An AI-powered study assistance platform that helps students manage their studies efficiently.



## ✨ Features## 🎉 **NEW: Upgraded to Java 21 LTS!**



### 🔐 User Authentication**Latest Update:** October 20, 2025  

- Secure JWT-based authentication✅ Java 21 LTS (from Java 17)  

- User registration and login✅ Spring Boot 3.3.5 (from 3.2.0)  

- Password encryption with BCrypt✅ Virtual Threads Enabled  

- Protected routes and API endpoints✅ Performance Optimizations Applied  



### 📊 Modern Dashboard**� See [JAVA_21_UPGRADE_SUMMARY.md](./JAVA_21_UPGRADE_SUMMARY.md) for full details**

- Beautiful, responsive design with gradient theme

- Real-time statistics display---

- Task management

- Activity tracking## �🚀 Tech Stack

- Notification system

- User profile management- **Frontend:** HTML, CSS, JavaScript (Vanilla)

- **Backend:** Spring Boot 3.3.5 (Java 21 LTS) ⚡

### 📂 File Management- **Database:** MySQL 8.x

- Drag & drop file upload- **Build Tool:** Maven 3.9.11 + Maven Wrapper

- Support for multiple file types (PDF, DOCX, Images, Excel)- **New Features:** Virtual Threads, Pattern Matching, Record Patterns

- File preview functionality

- Download and delete capabilities## 📁 Project Structure

- Storage quota tracking

- Smart file filtering and sorting```

ASAweb/

### 🎨 Professional Landing Page├── backend/

- Eye-catching hero section with "Learn Smarter, Not Harder"│   ├── src/main/java/com/aistudyassistant/

- Smooth animations and parallax effects│   │   ├── controller/

- Feature showcase│   │   ├── service/

- Pricing plans (Free, Pro, Teams)│   │   ├── repository/

- Customer testimonials│   │   ├── model/

- Call-to-action sections│   │   ├── config/

│   │   └── AiStudyAssistantApplication.java

## 🚀 Tech Stack│   ├── src/main/resources/

│   │   └── application.properties

- **Frontend:** HTML5, CSS3 (with animations), Vanilla JavaScript│   ├── uploads/

- **Backend:** Spring Boot 3.3.5 (Java 21 LTS)│   └── pom.xml

- **Database:** MySQL 8.x└── frontend/

- **Security:** Spring Security with JWT    ├── index.html

- **Build Tool:** Maven 3.9.11 + Maven Wrapper    ├── styles.css

    └── app.js

## 📁 Project Structure```



```## 🔧 Setup Instructions

ASAweb/

├── backend/### Prerequisites

│   ├── src/main/java/com/aistudyassistant/

│   │   ├── config/          # Security, CORS, Web config- **Java 21 or higher** (Java 23 currently installed ✅)

│   │   ├── controller/      # REST API endpoints- **Maven 3.6+** (Maven 3.9.11 installed ✅)

│   │   ├── model/           # Entity models (User, Role)- **MySQL 8.0+** (or H2 for quick dev setup)

│   │   ├── repository/      # JPA repositories- Modern web browser

│   │   ├── service/         # Business logic

│   │   └── AiStudyAssistantApplication.java**🚀 Quick Start:** See [backend/README.md](./backend/README.md) for detailed setup guide!

│   ├── src/main/resources/

│   │   └── application.properties### Backend Setup

│   └── pom.xml

└── frontend/1. **Create MySQL Database:**

    ├── css/   ```sql

    │   ├── auth.css              # Login/Register styles   CREATE DATABASE ai_study_db;

    │   ├── common.css            # Shared styles   ```

    │   ├── dashboard-modern.css  # Dashboard styles   

    │   ├── file-upload.css       # File upload styles   **Or use H2 for quick testing** (see [backend/README.md](./backend/README.md))

    │   └── landing.css           # Landing page styles

    ├── js/2. **Configure Database (if needed):**

    │   ├── auth.js               # Authentication logic   Edit `backend/src/main/resources/application.properties`:

    │   ├── dashboard-modern.js   # Dashboard functionality   ```properties

    │   ├── file-upload.js        # File upload handling   spring.datasource.username=YOUR_USERNAME

    │   └── landing.js            # Landing page effects   spring.datasource.password=YOUR_PASSWORD

    ├── pages/   ```

    │   └── file-upload.html      # File upload page

    ├── index-new.html            # Landing page3. **Run the Backend:**

    ├── login.html                # Login page   ```bash

    ├── register.html             # Register page   cd backend

    └── dashboard-new.html        # Main dashboard   

```   # Option 1: Using Maven

   mvn spring-boot:run

## 🔧 Setup Instructions   

   # Option 2: Using Maven Wrapper (recommended)

### Prerequisites   .\mvnw.cmd spring-boot:run

   ```

- **Java 21 or higher**   

- **Maven 3.6+**   Backend will start on `http://localhost:8080`

- **MySQL 8.0+**   

- Modern web browser   **✨ Now with Java 21 Virtual Threads for better performance!**



### Backend Setup### Frontend Setup



1. **Create MySQL Database:**1. **Open Frontend:**

   ```sql   Simply open `frontend/index.html` in your browser, or use a local server:

   CREATE DATABASE ai_study_db;   

   ```   ```bash

   cd frontend

2. **Configure Database:**   # Using Python

   Edit `backend/src/main/resources/application.properties`:   python -m http.server 3000

   ```properties   

   spring.datasource.username=YOUR_USERNAME   # Using Node.js (if you have http-server installed)

   spring.datasource.password=YOUR_PASSWORD   npx http-server -p 3000

   ```   ```

   

3. **Run the Backend:**   Frontend will be available at `http://localhost:3000`

   ```bash

   cd backend## 📋 Development Roadmap

   ./mvnw spring-boot:run

   ```### ✅ Phase 0 – Infrastructure Upgrade (COMPLETED) 🆕

   - [x] Upgraded to Java 21 LTS

   Backend will start on `http://localhost:8080`- [x] Updated Spring Boot to 3.3.5

- [x] Added Maven Wrapper

### Frontend Setup- [x] Enabled Virtual Threads

- [x] Optimized application configuration

Simply open the frontend files in a browser, or use a local server:- [x] Created comprehensive documentation



```bash### ✅ Phase 1 – Project Initialization (COMPLETED)

cd frontend- [x] Spring Boot project structure

python -m http.server 3000- [x] MySQL database configuration

```- [x] Frontend basic layout with 5 modules

- [x] CORS configuration

Frontend will be available at `http://localhost:3000`

### 🚧 Phase 2 – Module A: AI Study Engine

## 🎯 Current Development Status- [ ] File upload functionality

- [ ] File metadata storage

### ✅ Completed- [ ] Summary generation (mock)

- [x] Java 21 LTS upgrade

- [x] Spring Boot 3.3.5 setup### 📅 Phase 3 – Module B: AI Chat & Q&A

- [x] MySQL database integration- [ ] Chat endpoint

- [x] JWT authentication system- [ ] Chat UI

- [x] User registration & login- [ ] AI integration preparation

- [x] Professional landing page

- [x] Modern dashboard redesign### 📅 Phase 4 – Module C: Study Management Dashboard

- [x] File upload interface (UI ready)- [ ] Subject management

- [x] Responsive design (mobile-friendly)- [ ] Exam tracking

- [ ] Assignment management

### 🚧 In Progress- [ ] Note-taking

- [ ] Backend file upload API

- [ ] AI chat interface### 📅 Phase 5 – Module D: Productivity Tools

- [ ] Study management features- [ ] Pomodoro timer

- [ ] Productivity tools- [ ] Exam countdown

- [ ] AI study coach- [ ] Whiteboard notes

- [ ] Study statistics

## 🌐 API Endpoints

### 📅 Phase 6 – Module E: AI Study Coach

### Authentication- [ ] Study recommendations

- `POST /api/auth/register` - Register new user- [ ] Performance analytics

- `POST /api/auth/login` - User login

- `GET /api/auth/me` - Get current user### 📅 Phase 7 – Cloud Sync & Export

- `GET /api/auth/test` - Test endpoint- [ ] Cloud storage integration

- [ ] PDF export

### Files (Coming Soon)- [ ] Quiz generation

- `POST /api/files/upload` - Upload file

- `GET /api/files` - Get all user files### 📅 Phase 8 – Commercialization (Optional)

- `GET /api/files/:id/download` - Download file- [ ] User authentication

- `DELETE /api/files/:id` - Delete file- [ ] Pricing plans

- [ ] Payment integration

## 🎨 Design System

## 🎯 Features

- **Primary Color:** #6366F1 (Indigo)

- **Secondary Color:** #8B5CF6 (Purple)- **📚 Upload & Summarize:** Upload lecture files and get AI-generated summaries

- **Gradient Theme:** Linear gradients with smooth transitions- **💬 AI Chat & Q&A:** Ask questions about study material

- **Typography:** Inter font family- **📊 Study Dashboard:** Manage subjects, exams, and assignments

- **Animations:** Smooth hover effects, fade-ins, parallax scrolling- **⏱️ Productivity Tools:** Pomodoro timer, countdown, and statistics

- **🎯 AI Study Coach:** Personalized study recommendations

## 📄 License- **⚡ Java 21 Performance:** Virtual threads for better concurrency and responsiveness



MIT License - feel free to use for educational purposes.---



---## 📚 Documentation



**Built with ❤️ for students**- **[JAVA_21_UPGRADE_SUMMARY.md](./JAVA_21_UPGRADE_SUMMARY.md)** - Complete upgrade details

- **[backend/README.md](./backend/README.md)** - Quick start guide
- **[backend/JAVA_21_FEATURES.md](./backend/JAVA_21_FEATURES.md)** - Java 21 features guide
- **[DEVELOPER_CHECKLIST.md](./DEVELOPER_CHECKLIST.md)** - Development checklist

---

This is a learning project. Feel free to fork and experiment!

## 📄 License

MIT License - feel free to use for educational purposes.

---

**Built with ❤️ for students by students**
