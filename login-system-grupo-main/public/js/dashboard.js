document.addEventListener("DOMContentLoaded", async () => {
  const welcomeMessage = document.getElementById("welcomeMessage");
  const userName = document.getElementById("userName");
  const userUsername = document.getElementById("userUsername");
  const userEmail = document.getElementById("userEmail");
  const logoutBtn = document.getElementById("logoutBtn");

  try {
    const response = await fetch("/api/session");
    const data = await response.json();

    if (!data.user) {
      window.location.href = "/login";
      return;
    }

    const { name, username, email } = data.user;
    welcomeMessage.textContent = `Welcome, ${name || username}`;
    userName.textContent = name || "-";
    userUsername.textContent = username || "-";
    userEmail.textContent = email || "-";
  } catch (error) {
    window.location.href = "/login";
  }

  logoutBtn?.addEventListener("click", async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  });
});
