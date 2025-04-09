// src/app.js
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const { protect, adminOnly } = require("./middlewares/auth.middleware");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "../public")));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API routes
app.use("/api", require("./routes"));

// Page routes:
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/landing.html"));
});
app.get("/upload", protect, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/upload.html"));
});
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});
app.get("/projects", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/view-projects.html"));
});
app.get("/project/:id", (req, res) => {
  // Single project display page
  res.sendFile(path.join(__dirname, "../public/view-project.html"));
});
app.get("/ads", protect, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/ads.html"));
});
app.get("/view-ads", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/view-ads.html"));
});
app.get("/me", protect, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/user.html"));
});
app.get("/all-users", protect, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/all-user.html"));
});
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/about.html"));
});
app.get("/users/:username", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/profile.html"));
});

// New: Settings page route (protected)
app.get("/settings", protect, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/settings.html"));
});

module.exports = app;