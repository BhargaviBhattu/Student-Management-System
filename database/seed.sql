/* =====================================================
   SEED DATA FOR STUDENT MANAGEMENT SYSTEM
   ===================================================== */

USE student_management_system;

/* =====================================================
   USERS
   Password for ALL users below = 123456
   (bcrypt hash already generated)
   ===================================================== */

INSERT INTO users (name, email, password, role) VALUES
-- ADMIN
('Admin User', 'admin@gmail.com', '$2a$10$5y6yQ5U6eN0mY9YyQ9VbUe1wWcM3F9Z9Z3G0Z2uH5X7vE3nZrJ2Z6', 'ADMIN'),

-- TEACHERS
('Teacher One', 'teacher1@gmail.com', '$2a$10$5y6yQ5U6eN0mY9YyQ9VbUe1wWcM3F9Z9Z3G0Z2uH5X7vE3nZrJ2Z6', 'TEACHER'),
('Teacher Two', 'teacher2@gmail.com', '$2a$10$5y6yQ5U6eN0mY9YyQ9VbUe1wWcM3F9Z9Z3G0Z2uH5X7vE3nZrJ2Z6', 'TEACHER'),

-- STUDENTS
('Rahul', 'rahul@gmail.com', '$2a$10$5y6yQ5U6eN0mY9YyQ9VbUe1wWcM3F9Z9Z3G0Z2uH5X7vE3nZrJ2Z6', 'STUDENT'),
('Ravi', 'ravi@gmail.com', '$2a$10$5y6yQ5U6eN0mY9YyQ9VbUe1wWcM3F9Z9Z3G0Z2uH5X7vE3nZrJ2Z6', 'STUDENT'),
('Ramya', 'ramya@gmail.com', '$2a$10$5y6yQ5U6eN0mY9YyQ9VbUe1wWcM3F9Z9Z3G0Z2uH5X7vE3nZrJ2Z6', 'STUDENT'),

-- PARENTS
('Parent Rahul', 'parent.rahul@gmail.com', '$2a$10$5y6yQ5U6eN0mY9YyQ9VbUe1wWcM3F9Z9Z3G0Z2uH5X7vE3nZrJ2Z6', 'PARENT'),
('Parent Ravi', 'parent.ravi@gmail.com', '$2a$10$5y6yQ5U6eN0mY9YyQ9VbUe1wWcM3F9Z9Z3G0Z2uH5X7vE3nZrJ2Z6', 'PARENT');


/* =====================================================
   STUDENTS TABLE
   ===================================================== */

INSERT INTO students (user_id, roll_no, department, year) VALUES
(4, 'CS101', 'CSE', 3),
(5, 'CS102', 'CSE', 2),
(6, 'CS103', 'ECE', 1);


/* =====================================================
   TEACHERS TABLE
   ===================================================== */

INSERT INTO teachers (user_id, department) VALUES
(2, 'CSE'),
(3, 'ECE');


/* =====================================================
   PARENTS TABLE
   ===================================================== */

INSERT INTO parents (user_id, phone) VALUES
(7, '9876543210'),
(8, '9876501234');


/* =====================================================
   STUDENT ↔ PARENT MAPPING
   ===================================================== */

INSERT INTO student_parent (student_id, parent_id) VALUES
(1, 1), -- Rahul ↔ Parent Rahul
(2, 2); -- Ravi ↔ Parent Ravi


/* =====================================================
   ATTENDANCE
   ===================================================== */

INSERT INTO attendance (student_id, subject, marks, attendance_percentage) VALUES
(1, 'Mathematics', 85, 92.5),
(1, 'Physics', 78, 88.0),
(2, 'Mathematics', 90, 95.0),
(3, 'Electronics', 80, 85.0);


/* =====================================================
   COMMENTS (PARENT → TEACHER)
   ===================================================== */
INSERT INTO comments (parent_id, student_id, teacher_id, message, status) VALUES
(1, 1, 1, 'Please improve my child’s maths performance', 'OPEN'),
(2, 2, 2, 'Attendance seems low last month', 'OPEN');



/* =====================================================
   TEACHER RESPONSES
   ===================================================== */

UPDATE comments
SET reply = 'We are arranging extra classes',
    status = 'RESPONDED'
WHERE id = 1;
