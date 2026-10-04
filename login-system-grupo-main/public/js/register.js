document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const message = document.getElementById("message");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      name: document.getElementById("name")?.value.trim(),
      username: document.getElementById("username")?.value.trim(),
      email: document.getElementById("email")?.value.trim(),
      password: document.getElementById("password")?.value,
    };

    if (!payload.name || !payload.username || !payload.email || !payload.password) {
      if (message) {
        message.textContent = "Please complete all fields.";
        message.className = "message error";
      }
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
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
