/* =====================================================
   GLOBAL ATTENDANCE API
   (API comes from auth.js)
===================================================== */

console.log("attendance.js loaded");

const ATTENDANCE_API = `${API}/attendance`;

/* =====================================================
   STUDENT SIDE
===================================================== */
window.loadMyAttendanceAPI = async function () {
  try {
    const res = await fetch(`${ATTENDANCE_API}/me`, {
      headers: authHeader()
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to fetch attendance");
    }

    const attendance = await res.json();
    renderAttendanceTable(attendance);

  } catch (err) {
    console.error("Student attendance error:", err);
    alert("Failed to load attendance");
  }
};

/* =====================================================
   PARENT SIDE
===================================================== */
window.loadChildAttendanceAPI = async function () {
  try {
    const res = await fetch(`${ATTENDANCE_API}/child`, {
      headers: authHeader()
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to fetch child attendance");
    }

    const attendance = await res.json();
    renderAttendanceTable(attendance);

  } catch (err) {
    console.error("Parent attendance error:", err);
    alert("Failed to load child attendance");
  }
};

/* =====================================================
   TEACHER SIDE (READ-ONLY VIEW)
===================================================== */
window.loadTeacherAttendanceAPI = async function () {
  try {
    const res = await fetch(`${ATTENDANCE_API}/teacher`, {
      headers: authHeader()
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to fetch attendance");
    }

    const attendance = await res.json();
    renderAttendanceTable(attendance);

  } catch (err) {
    console.error("Teacher attendance error:", err);
    alert("Failed to load attendance");
  }
};

/* =====================================================
   ADD ATTENDANCE (TEACHER)
===================================================== */
window.addAttendance = async function (
  student_id,
  subject,
  marks,
  attendance_percentage
) {
  try {
    const res = await fetch(ATTENDANCE_API, {
      method: "POST",
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        student_id,
        subject,
        marks,
        attendance_percentage
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Add attendance failed");
    }

    alert("Attendance added successfully");

    if (typeof loadTeacherAttendanceAPI === "function") {
      loadTeacherAttendanceAPI();
    }

  } catch (err) {
    console.error("Add attendance error:", err);
    alert("Failed to add attendance");
  }
};

/* =====================================================
   UPDATE ATTENDANCE (TEACHER)
===================================================== */
window.updateAttendance = async function (
  id,
  marks,
  attendance_percentage
) {
  try {
    const res = await fetch(`${ATTENDANCE_API}/${id}`, {
      method: "PUT",
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ marks, attendance_percentage })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Update failed");
    }

    alert("Attendance updated successfully");

    if (typeof loadTeacherAttendanceAPI === "function") {
      loadTeacherAttendanceAPI();
    }

  } catch (err) {
    console.error("Update attendance error:", err);
    alert("Failed to update attendance");
  }
};

/* =====================================================
   COMMON TABLE RENDER
   Subject | Marks | Attendance %
===================================================== */
function renderAttendanceTable(attendance) {
  const tbody = document.getElementById("attendanceTable");
  if (!tbody) return; // ✅ prevents crashes

  tbody.innerHTML = "";

  if (!Array.isArray(attendance) || attendance.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center text-muted">
          No attendance available
        </td>
      </tr>
    `;
    return;
  }

  attendance.forEach(a => {
    const subject = a.subject || "-";
    const marks =
      a.marks !== null && a.marks !== undefined ? a.marks : "-";
    const percentage =
      a.attendance_percentage !== null &&
      a.attendance_percentage !== undefined
        ? `${a.attendance_percentage}%`
        : "-";

    tbody.innerHTML += `
      <tr>
        <td>${subject}</td>
        <td>${marks}</td>
        <td>${percentage}</td>
      </tr>
    `;
  });
}

/* =====================================================
   SAFE DOM READY (NO EVENT BINDINGS)
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("attendance.js DOM ready");
});



