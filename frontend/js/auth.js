const API = "http://localhost:5000/api";

/* =====================================================
   AUTH HEADER (USED EVERYWHERE)
   ===================================================== */

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* =====================================================
   LOGIN
   ===================================================== */

async function login(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    /* ==========================
       STORE AUTH DATA
       ========================== */

    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.user.role);

    /*
      NOTE:
      selectedRole comes from landing page
      userRole comes from backend (source of truth)
    */

    /* ==========================
       ROLE-BASED REDIRECT
       ========================== */

    switch (data.user.role) {
      case "ADMIN":
        window.location.href = "admin.html";
        break;

      case "TEACHER":
        window.location.href = "teacher.html";
        break;

      case "STUDENT":
        window.location.href = "student.html";
        break;

      case "PARENT":
        window.location.href = "parent.html";
        break;

      default:
        alert("Unknown user role");
        logout();
    }

  } catch (err) {
    alert("Server error. Please try again.");
    console.error(err);
  }
}

/* =====================================================
   LOGOUT
   ===================================================== */

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("selectedRole");

  window.location.href = "login.html";
}

