

/* =====================================================
   UI HELPER
   ===================================================== */

function hideAll() {
  ["profileSection", "attendanceSection"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("d-none");
  });
}

/* =====================================================
   PROFILE
   ===================================================== */

async function loadProfile() {
  hideAll();
  document
    .getElementById("profileSection")
    .classList.remove("d-none");

  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: authHeader()
    });

    const user = await res.json();

    document.getElementById("pName").innerText =
      user.name || "-";
    document.getElementById("pEmail").innerText =
      user.email || "-";
    document.getElementById("pRole").innerText =
      user.role || "-";

  } catch (err) {
    alert("Failed to load profile");
    console.error(err);
  }
}

/* =====================================================
   ATTENDANCE
   ===================================================== */

function loadAttendance() {
  hideAll();
  document.getElementById("attendanceSection").classList.remove("d-none");

  if (typeof loadMyAttendanceAPI !== "function") {
    console.error("loadMyAttendanceAPI not loaded");
    alert("Attendance module not loaded");
    return;
  }

  loadMyAttendanceAPI();
}
