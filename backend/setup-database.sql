-- AI Study Assistant Database Setup Script
-- Run this script in MySQL Workbench or MySQL Command Line

-- Create the database
CREATE DATABASE IF NOT EXISTS ai_study_db;

-- Use the database
USE ai_study_db;

-- Verify database is created
SELECT DATABASE();

-- Show all tables (should be empty initially)
SHOW TABLES;

-- Grant all privileges (if needed)
-- Replace 'root' and 'your_password' with your MySQL credentials
-- GRANT ALL PRIVILEGES ON ai_study_db.* TO 'root'@'localhost';
-- FLUSH PRIVILEGES;

-- Database is ready!
-- Spring Boot will automatically create tables when you start the application
-- because hibernate.ddl-auto=update is configured in application.properties

-- Optional: Create a sample user for testing
-- You can add this after creating your User entity in Spring Boot
-- Example:
-- INSERT INTO users (name, email, created_at) VALUES ('Test Student', 'test@example.com', NOW());
