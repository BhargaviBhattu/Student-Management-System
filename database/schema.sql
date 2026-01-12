-- ==============================
-- CREATE DATABASE
-- ==============================
CREATE DATABASE IF NOT EXISTS student_management_system;
USE student_management_system;

-- ==============================
-- USERS TABLE (AUTH BASE)
-- ==============================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN','TEACHER','STUDENT','PARENT') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- STUDENTS TABLE
-- ==============================
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    roll_no VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(50),
    year INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================
-- TEACHERS TABLE
-- ==============================
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    department VARCHAR(50),
    designation VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================
-- PARENTS TABLE
-- ==============================
CREATE TABLE IF NOT EXISTS parents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    phone VARCHAR(15),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================
-- STUDENT-PARENT MAPPING
-- ==============================
CREATE TABLE IF NOT EXISTS student_parent (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    parent_id INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE,
    UNIQUE(student_id, parent_id)
);

-- ==============================
-- ATTENDANCE TABLE
-- ==============================
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    marks INT,
    attendance_percentage DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ==============================
-- COMMENTS (PARENT ↔ TEACHER)
-- ==============================
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    student_id INT NOT NULL,
    parent_id INT NOT NULL,
    teacher_id INT NULL,  -- ✅ allow null until assigned

    message TEXT NOT NULL,
    reply TEXT,

    status ENUM('OPEN','REPLIED') DEFAULT 'OPEN',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,

    INDEX idx_parent (parent_id),
    INDEX idx_teacher (teacher_id),
    INDEX idx_student (student_id)
);


