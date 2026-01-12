console.log("teacher.js loaded");

/* ============================
   HIDE ALL SECTIONS
============================ */
function hideAll() {
  ["manageStudentsSection", "commentsSection"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("d-none");
  });
}

/* ============================
   MANAGE STUDENTS
============================ */
window.loadManageStudents = async function () {
  console.log("Loading Manage Students...");

  hideAll();
  document
    .getElementById("manageStudentsSection")
    .classList.remove("d-none");

  try {
    const res = await fetch(`${API}/teachers/manage-students`, {
      headers: authHeader()
    });

    if (!res.ok) throw new Error("Failed to fetch students");

    const rows = await res.json();
    console.log("Students data:", rows);

    const tbody = document.getElementById("manageStudentsTable");
    tbody.innerHTML = "";

    if (!rows.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-muted">
            No students found
          </td>
        </tr>`;
      return;
    }

    rows.forEach(row => {
      tbody.innerHTML += `
        <tr>
          <td>${row.student_name}</td>
          <td>${row.roll_no}</td>
          <td>${row.department}</td>
          <td>${row.year}</td>

          <td>
            <input class="form-control form-control-sm"
              id="sub-${row.student_id}-${row.attendance_id || 0}"
              value="${row.subject || ""}"
              placeholder="Subject">
          </td>

          <td>
            <input class="form-control form-control-sm"
              id="marks-${row.student_id}-${row.attendance_id || 0}"
              value="${row.marks ?? ""}">
          </td>

          <td>
            <input class="form-control form-control-sm"
              id="att-${row.student_id}-${row.attendance_id || 0}"
              value="${row.attendance_percentage ?? ""}">
          </td>

          <td>
            <button class="btn btn-sm btn-success"
              onclick="saveAttendance(
                '${row.attendance_id}',
                '${row.student_id}'
              )">
              Save
            </button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load student data");
  }
};

/* ============================
   SAVE ATTENDANCE
============================ */
window.saveAttendance = async function (attendanceId, studentId) {
  const subject = document.getElementById(
    `sub-${studentId}-${attendanceId || 0}`
  ).value;

  const marks = document.getElementById(
    `marks-${studentId}-${attendanceId || 0}`
  ).value;

  const attendance_percentage = document.getElementById(
    `att-${studentId}-${attendanceId || 0}`
  ).value;

  if (!subject || marks === "" || attendance_percentage === "") {
    alert("All fields required");
    return;
  }

  try {
    if (attendanceId) {
      await fetch(`${API}/teachers/attendance/${attendanceId}`, {
        method: "PUT",
        headers: {
          ...authHeader(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ marks, attendance_percentage })
      });
    } else {
      await fetch(`${API}/teachers/attendance`, {
        method: "POST",
        headers: {
          ...authHeader(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          student_id: studentId,
          subject,
          marks,
          attendance_percentage
        })
      });
    }

    alert("Saved successfully");
    loadManageStudents();

  } catch (err) {
    console.error(err);
    alert("Save failed");
  }
};

/* ============================
   COMMENTS
============================ */
window.loadTeacherComments = function () {
  hideAll();
  document.getElementById("commentsSection").classList.remove("d-none");
  loadTeacherCommentsAPI();
};

/* ============================
   BINDINGS
============================ */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Teacher dashboard ready");

  document
    .getElementById("manageStudentsBtn")
    .addEventListener("click", loadManageStudents);

  document
    .getElementById("commentsBtn")
    .addEventListener("click", loadTeacherComments);

  document
    .getElementById("logoutBtn")
    .addEventListener("click", logout);
});



