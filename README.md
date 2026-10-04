# Login System Study Project

This project is a simple authentication system built as a study project to demonstrate how a basic login and registration flow works in a full-stack web application using Node.js, Express, and SQLite.

It is designed to help students understand the fundamentals of:

- user registration
- login validation
- password hashing
- session-based authentication
- serving static HTML pages
- database persistence with SQLite

---

## Project Overview

This app allows a user to:

1. register a new account
2. sign in with a username and password
3. access a protected dashboard after login
4. log out safely
5. reset their password through a basic reset flow

The project is intentionally simple and beginner-friendly, making it suitable for academic learning and demonstration.

---

## Technologies Used

- Node.js
- Express.js
- SQLite via better-sqlite3
- bcrypt for password hashing
- HTML, CSS, and JavaScript for the frontend

---

## Project Structure

```text
login-system-grupo-main/
├── db.js               # SQLite database logic and authentication functions
├── server.js           # Express server and routes
├── package.json        # Project scripts and dependencies
├── authentication.db   # SQLite database file created at runtime
├── public/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── forgot-password.html
│   └── signin.html
└── README.md
```

---

## Step-by-Step Instructions for Access

### 1. Open the project folder
Open the folder named:

```text
login-system-grupo-main
```

### 2. Install dependencies
In the terminal, run:

```bash
npm install
```

This installs the required packages for Express, SQLite, bcrypt, and session handling.

### 3. Start the application
Run:

```bash
npm start
```

The server will start and listen on port 3000 because port 5000 is already occupied in this environment.

### 4. Open the app in a browser
Go to:

```text
http://localhost:3000
```

### 5. Use the login system
From the home page, the professor or user can:

- create a new account by clicking "Create account"
- sign in using the username and password
- access the dashboard after successful login
- log out from the dashboard

---

## How the Login System Works

### Registration Flow
When a user registers:

- the frontend sends the form data to `/api/register`
- the server receives the request
- the app checks if the username or email already exists
- the password is hashed using bcrypt before storing it in SQLite
- the user record is saved in the database

### Login Flow
When a user logs in:

- the frontend sends the username and password to `/api/login`
- the server looks up the user in the database
- the submitted password is compared with the stored hashed password
- if the data is valid, the user is added to the session
- the user is redirected to the dashboard

### Session Handling
The app uses Express session middleware to keep the user logged in while the browser session is active.

### Dashboard Protection
The dashboard is protected and checks if the user exists in the active session before allowing access.

---

## Security Note

This is a study project, not a production-grade security system. It demonstrates the basics of authentication, but real-world applications should also include:

- stronger validation and sanitization
- password reset email systems
- proper token management
- CSRF protection
- role-based authorization
- encrypted environment configuration
- real production database setup

---

## Learning Goals

This project helps students understand:

- server-side routing
- form handling with HTML and JavaScript
- connecting frontend and backend
- database operations
- password encryption and comparison
- user session management
- basic app flow from registration to protected access

---

## Recommended Demo Flow for the Professor

1. Start the server.
2. Open the app in the browser.
3. Register a test account.
4. Log in with that account.
5. Show the dashboard after successful authentication.
6. Explain how password hashing is used before storing data.
7. Mention that the system uses a session to identify the logged-in user.
8. Explain how the SQLite database stores user records.

---

## Conclusion

This project is a simple but effective example of a login system for educational purposes. It demonstrates how a basic authentication flow works in practice while introducing key web development concepts that are useful for students learning backend, database, and frontend integration.

---

## Developer Note

This repository was created for academic learning and demonstration. It is intentionally simple and focused on readability so students can understand the logic clearly.
