// project.routes.js
const express = require("express");
const multer = require("multer");
const { protect } = require("../middlewares/auth.middleware");
const {
  uploadProject,
  getProjects,
  getMyProjects,
  getProjectById,
} = require("../controllers/project.controller");

// Use memory storage so the file is available in req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/", getProjects);
router.get("/my-projects", protect, getMyProjects);
router.get("/:id", getProjectById);
router.post("/", protect, upload.single("file"), uploadProject);

module.exports = router;