const COMMENT_API = `${API}/comments`;

/* =====================================================
   TEACHER SIDE
   ===================================================== */

// Load comments for teacher dashboard
async function loadTeacherCommentsAPI() {
  try {
    const res = await fetch(`${COMMENT_API}/teacher`, {
      headers: authHeader()
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to load comments");
    }

    const comments = await res.json();
    renderTeacherComments(comments);

  } catch (err) {
    console.error("Teacher comments error:", err);
    alert("Failed to load parent comments");
  }
}

// Teacher → Reply to comment
async function replyToComment(commentId) {
  const replyText = prompt("Enter reply");
  if (!replyText || !replyText.trim()) return;

  try {
    const res = await fetch(`${COMMENT_API}/reply/${commentId}`, {
      method: "PUT",
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ reply: replyText.trim() })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Reply failed");
    }

    alert("Reply sent successfully");
    loadTeacherCommentsAPI();

  } catch (err) {
    console.error("Reply error:", err);
    alert("Failed to send reply");
  }
}

// Render comments for teacher
function renderTeacherComments(comments) {
  const div = document.getElementById("commentsList");
  if (!div) return;

  div.innerHTML = "";

  if (!Array.isArray(comments) || comments.length === 0) {
    div.innerHTML = `
      <p class="text-muted text-center">
        No parent comments available
      </p>
    `;
    return;
  }

  comments.forEach(c => {
    div.innerHTML += `
      <div class="border rounded p-3 mb-3 bg-light">
        <p><strong>Parent:</strong> ${c.parent_name}</p>
        <p><strong>Student:</strong> ${c.student_name} (${c.roll_no})</p>
        <p><strong>Comment:</strong> ${c.message}</p>

        ${
          c.reply
            ? `<p class="text-success mt-2">
                 <strong>Your Reply:</strong> ${c.reply}
               </p>`
            : `<button
                 class="btn btn-sm btn-primary mt-2"
                 onclick="replyToComment(${c.id})">
                 Reply
               </button>`
        }
      </div>
    `;
  });
}

/* =====================================================
   PARENT SIDE
   ===================================================== */

// Add new comment (parent)
async function addComment(event) {
  event.preventDefault();

  const input = document.getElementById("commentText");
  if (!input) return;

  const message = input.value.trim();
  if (!message) {
    alert("Please enter a comment");
    return;
  }

  try {
    const res = await fetch(COMMENT_API, {
      method: "POST",
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to submit comment");
    }

    input.value = "";
    loadMyCommentsAPI();

  } catch (err) {
    console.error("Add comment error:", err);
    alert("Failed to submit comment");
  }
}

// Load parent comment history
async function loadMyCommentsAPI() {
  try {
    const res = await fetch(`${COMMENT_API}/my`, {
      headers: authHeader()
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to load comments");
    }

    const comments = await res.json();
    renderMyComments(comments);

  } catch (err) {
    console.error("Parent comments error:", err);
    alert("Failed to load comments");
  }
}

// Render parent comments
function renderMyComments(comments) {
  const div = document.getElementById("commentsList");
  if (!div) return;

  div.innerHTML = "";

  if (!Array.isArray(comments) || comments.length === 0) {
    div.innerHTML = `
      <p class="text-muted text-center">
        You have not raised any comments yet
      </p>
    `;
    return;
  }

  comments.forEach(c => {
    div.innerHTML += `
      <div class="border rounded p-3 mb-3">
        <p><strong>You:</strong> ${c.message}</p>

        ${
          c.reply
            ? `<p class="text-success">
                 <strong>Teacher Reply:</strong> ${c.reply}
               </p>`
            : `<p class="text-muted">
                 Waiting for teacher reply
               </p>`
        }
      </div>
    `;
  });
}


