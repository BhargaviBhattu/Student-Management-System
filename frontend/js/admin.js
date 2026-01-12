/* =====================================================
   SECTION VISIBILITY HELPERS
   ===================================================== */

function hideAllSections() {
  [
    "addStudentSection",
    "addParentSection",
    "addTeacherSection",
    "studentList"
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("d-none");
  });
}

function showSection(sectionId) {
  hideAllSections();
  const section = document.getElementById(sectionId);
  if (section) section.classList.remove("d-none");

  // ✅ Load students when adding parent
  if (sectionId === "addParentSection") {
    loadStudentsForParent();
  }

  // ✅ Load teachers when adding student
  if (sectionId === "addStudentSection") {
    loadTeachersForStudent();
  }
}

/* =====================================================
   LOAD STUDENTS FOR PARENT DROPDOWN
   ===================================================== */

async function loadStudentsForParent() {
  try {
    const res = await fetch(`${API}/admin/students`, {
      headers: authHeader()
    });

    if (!res.ok) throw new Error("Failed to fetch students");

    const students = await res.json();
    const select = document.getElementById("parentStudentId");

    select.innerHTML = `<option value="">-- Select Student --</option>`;

    students.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = `${s.name} (${s.email})`;
      select.appendChild(opt);
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load students for parent");
  }
}

/* =====================================================
   LOAD TEACHERS FOR STUDENT DROPDOWN (NEW ✅)
   ===================================================== */

async function loadTeachersForStudent() {
  try {
    const res = await fetch(`${API}/admin/teachers`, {
      headers: authHeader()
    });

    if (!res.ok) throw new Error("Failed to fetch teachers");

    const teachers = await res.json();
    const select = document.getElementById("studentTeacherId");

    select.innerHTML = `<option value="">-- Select Teacher --</option>`;

    teachers.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `${t.name} (${t.department})`;
      select.appendChild(opt);
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load teachers");
  }
}

/* =====================================================
   VIEW STUDENTS (ADMIN)
   ===================================================== */

async function loadStudents() {
  showSection("studentList");

  try {
    const res = await fetch(`${API}/admin/students`, {
      headers: authHeader()
    });

    if (!res.ok) throw new Error("Failed to fetch students");

    const students = await res.json();
    const tbody = document.getElementById("studentsTable");
    tbody.innerHTML = "";

    if (!students.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted">
            No students found
          </td>
        </tr>
      `;
      return;
    }

    students.forEach(s => {
      tbody.innerHTML += `
        <tr>
          <td>${s.name}</td>
          <td>${s.email}</td>
          <td>${s.roll_no}</td>
          <td>${s.department}</td>
          <td>${s.year}</td>
          <td>
            <button
              class="btn btn-sm btn-danger"
              onclick="deleteUser(${s.user_id})">
              Delete
            </button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load students");
  }
}

/* =====================================================
   ADD STUDENT (UPDATED WITH teacher_id ✅)
   ===================================================== */

async function addStudent(event) {
  event.preventDefault();

  const payload = {
    name: document.getElementById("studentName").value.trim(),
    email: document.getElementById("studentEmail").value.trim(),
    password: document.getElementById("studentPassword").value.trim(),
    roll_no: document.getElementById("studentRoll").value.trim(),
    department: document.getElementById("studentDepartment").value.trim(),
    year: Number(document.getElementById("studentYear").value),
    teacher_id: Number(document.getElementById("studentTeacherId").value)
  };

  if (
    !payload.name ||
    !payload.email ||
    !payload.password ||
    !payload.roll_no ||
    !payload.department ||
    !Number.isInteger(payload.year) ||
    !payload.teacher_id
  ) {
    alert("All student fields and teacher selection are required");
    return;
  }

  try {
    const res = await fetch(`${API}/admin/students`, {
      method: "POST",
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message);

    alert("Student added and teacher assigned successfully");
    event.target.reset();
    loadStudents();

  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to add student");
  }
}

/* =====================================================
   ADD PARENT
   ===================================================== */

async function addParent(event) {
  event.preventDefault();

  const payload = {
    name: document.getElementById("parentName").value.trim(),
    email: document.getElementById("parentEmail").value.trim(),
    password: document.getElementById("parentPassword").value.trim(),
    phone: document.getElementById("parentPhone").value.trim(),
    student_id: Number(document.getElementById("parentStudentId").value)
  };

  if (
    !payload.name ||
    !payload.email ||
    !payload.password ||
    !payload.student_id
  ) {
    alert("All parent fields and student selection are required");
    return;
  }

  try {
    const res = await fetch(`${API}/admin/parents`, {
      method: "POST",
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message);

    alert("Parent added and linked successfully");
    event.target.reset();

  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to add parent");
  }
}

/* =====================================================
   ADD TEACHER
   ===================================================== */

async function addTeacher(event) {
  event.preventDefault();

  const payload = {
    name: document.getElementById("teacherName").value.trim(),
    email: document.getElementById("teacherEmail").value.trim(),
    password: document.getElementById("teacherPassword").value.trim(),
    department: document.getElementById("teacherDepartment").value.trim()
  };

  if (
    !payload.name ||
    !payload.email ||
    !payload.password ||
    !payload.department
  ) {
    alert("All teacher fields are required");
    return;
  }

  try {
    const res = await fetch(`${API}/admin/teachers`, {
      method: "POST",
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message);

    alert("Teacher added successfully");
    event.target.reset();

  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to add teacher");
  }
}

/* =====================================================
   DELETE USER
   ===================================================== */

async function deleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const res = await fetch(`${API}/admin/users/${userId}`, {
      method: "DELETE",
      headers: authHeader()
    });

    if (!res.ok) throw new Error("Delete failed");

    alert("User deleted successfully");
    loadStudents();

  } catch (err) {
    console.error(err);
    alert("Failed to delete user");
  }
}







