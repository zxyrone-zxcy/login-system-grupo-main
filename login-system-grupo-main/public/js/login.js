document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const message = document.getElementById("message");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      username: document.getElementById("username")?.value.trim(),
      password: document.getElementById("password")?.value,
    };

    if (!payload.username || !payload.password) {
      if (message) {
        message.textContent = "Please fill in both fields.";
        message.className = "message error";
      }
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (message) {
        message.textContent = data.message;
        message.className = "message success";
      }

      window.location.href = "/dashboard";
    } catch (error) {
      if (message) {
        message.textContent = error.message;
        message.className = "message error";
      }
    }
  });
});
