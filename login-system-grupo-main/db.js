import Database from "better-sqlite3";
import bcrypt from "bcrypt";

const db = new Database("authentication.db");
db.pragma("journal_mode = WAL");

const createTableSql = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`;

db.exec(createTableSql);
console.log("sqlite Connected");

function getUsers() {
  return db
    .prepare(
      "SELECT id, name, username, email, created_at FROM users ORDER BY id",
    )
    .all();
}

async function Register(user) {
  if (!user?.name || !user?.username || !user?.email || !user?.password) {
    throw new Error("All fields are required");
  }

  const name = user.name.trim();
  const username = user.username.trim();
  const email = user.email.trim();
  const password = user.password;

  const existingUser = db
    .prepare("SELECT id FROM users WHERE username = ? OR email = ?")
    .get(username, email);

  if (existingUser) {
    throw new Error("Username or email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = db
    .prepare(
      "INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)",
    )
    .run(name, username, email, hashedPassword);

  return {
    id: result.lastInsertRowid,
    name,
    username,
    email,
  };
}

async function Login(username, password) {
  const normalizedUsername = typeof username === "string" ? username.trim() : "";
  const user = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(normalizedUsername);

  if (!user) {
    throw new Error("User not found");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid password");
  }

  const { password: _password, ...safeUser } = user;
  return safeUser;
}

async function ResetPassword(email, password, confirmPassword) {
  if (!email || !password || !confirmPassword) {
    throw new Error("Email and new password are required.");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email.trim());

  if (!user) {
    throw new Error("Email not found.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  db.prepare("UPDATE users SET password = ? WHERE email = ?").run(
    hashedPassword,
    email.trim(),
  );

  return { success: true };
}

function findUserByEmail(email) {
  return db.prepare("SELECT id, email FROM users WHERE email = ?").get(email.trim());
}

export { db, Register, Login, getUsers, ResetPassword, findUserByEmail };
