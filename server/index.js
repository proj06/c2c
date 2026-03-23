require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const contentRoutes = require("./routes/content");
const { verifyToken, optionalAuth } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Strip MongoDB operators ($gt, $where, etc.) from all input
app.use(mongoSanitize());

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.static(path.join(__dirname, "../public")));

// ─── MongoDB Connection ────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",authRoutes);
app.use("/api/admin",verifyToken, adminRoutes);
app.use("/api/content", contentRoutes);

// ─── Page Routes ──────────────────────────────────────────────────────────────
app.get("/", optionalAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});
app.get("/blog/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/blog-post.html"));
});
app.get("/admin", verifyToken, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).redirect("/login?error=unauthorized");
  res.sendFile(path.join(__dirname, "../public/admin.html"));
});

// ─── 404 Fallback ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public/index.html"));
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 C2C Club server running at http://localhost:${PORT}`);
});
