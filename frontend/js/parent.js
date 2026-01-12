// ❌ DO NOT redeclare API here
// API comes from auth.js

console.log("parent.js loaded");

/* =====================================================
   HIDE ALL SECTIONS
   ===================================================== */
function hideAll() {
  [
    "childProfileSection",
    "attendanceSection",
    "commentsSection"
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("d-none");
  });
}

/* =====================================================
   CHILD PROFILE
   ===================================================== */
async function loadChildProfile() {
  console.log("Loading child profile...");

  hideAll();

  const section = document.getElementById("childProfileSection");
  if (section) section.classList.remove("d-none");

  try {
    const res = await fetch(`${API}/parents/my-child`, {
      headers: authHeader()
    });

    const data = await res.json(); // ✅ read once

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch child");
    }

    document.getElementById("cName").innerText = data.name || "-";
    document.getElementById("cEmail").innerText = data.email || "-";

  } catch (err) {
    console.error("Child profile error:", err);
    alert(err.message || "Unable to load child profile");
  }
}

/* =====================================================
   ATTENDANCE
   ===================================================== */
function loadAttendance() {
  console.log("Loading child attendance...");

  hideAll();

  const section = document.getElementById("attendanceSection");
  if (section) section.classList.remove("d-none");

  if (typeof loadChildAttendanceAPI === "function") {
    loadChildAttendanceAPI(); // ✅ always fetch fresh data
  } else {
    console.error("❌ loadChildAttendanceAPI is not loaded");
    alert("Attendance module not available");
  }
}

/* =====================================================
   COMMENTS
   ===================================================== */
function loadComments() {
  console.log("Loading parent comments...");

  hideAll();

  const section = document.getElementById("commentsSection");
  if (section) section.classList.remove("d-none");

  if (typeof loadMyCommentsAPI === "function") {
    loadMyCommentsAPI(); // ✅ reload after submit
  } else {
    console.error("❌ loadMyCommentsAPI is not loaded");
    alert("Comments module not available");
  }
}

/* =====================================================
   BUTTON & FORM BINDINGS
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Parent dashboard ready");

  const childBtn = document.getElementById("childProfileBtn");
  const attendanceBtn = document.getElementById("attendanceBtn");
  const commentsBtn = document.getElementById("commentsBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const commentForm = document.getElementById("commentForm");

  if (childBtn) childBtn.addEventListener("click", loadChildProfile);
  if (attendanceBtn) attendanceBtn.addEventListener("click", loadAttendance);
  if (commentsBtn) commentsBtn.addEventListener("click", loadComments);
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  // ✅ Prevent duplicate submit bindings
  if (commentForm && typeof addComment === "function") {
    commentForm.addEventListener("submit", addComment);
  }
});






