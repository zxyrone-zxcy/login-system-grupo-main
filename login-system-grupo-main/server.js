import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { Register, Login, getUsers, ResetPassword, findUserByEmail } from "./db.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "login-system-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    },
  }),
);

app.use(express.static(path.join(__dirname, "public")));

const requireAuth = (req, res, next) => {
  if (req.session.user) {
    return next();
  }

  return res.status(401).json({ message: "Unauthorized. Please log in." });
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/api/session", (req, res) => {
  res.json({ user: req.session.user || null });
});

app.get("/api/users", requireAuth, (req, res) => {
  res.json({
    message: "Get all the users",
    users: getUsers(),
  });
});

app.post("/api/register", async (req, res) => {
  try {
    const user = await Register(req.body);
    req.session.user = user;
    res.status(201).json({
      message: "Successfully registered",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Registration failed",
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const user = await Login(req.body.username, req.body.password);
    req.session.user = user;
    res.json({
      message: "Successfully logged in",
      user,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message || "Login failed",
    });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully" });
  });
});

app.post("/api/user/send-email", (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ success: false, message: "Please enter an email." });
  }

  const user = findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ success: false, message: "Email not found." });
  }

  return res.json({ success: true, message: "Email found." });
});

app.put("/api/user/reset-password", async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body || {};
    const result = await ResetPassword(email, password, confirm_password);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Password reset failed." });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
