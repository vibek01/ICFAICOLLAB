// project.routes.js
const express = require("express");
const multer = require("multer");
const { protect } = require("../middlewares/auth.middleware");
const {
  uploadProject,
  getProjects,
  getMyProjects,
  getProjectById,
  likeProject,
  getProjectsByUser,
  deleteProject,
} = require("../controllers/project.controller");

// Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Use upload.fields() to accept multiple file fields:
// - 'previewImage': a single preview image (required)
// - 'projectImages': multiple project images
// - 'demo-video': an optional demo video
// - 'file': an optional main file
router.get("/", getProjects);
router.get("/my-projects", protect, getMyProjects);
router.get("/:id", getProjectById);
router.post(
  "/",
  protect,
  upload.fields([
    { name: "previewImage", maxCount: 1 },
    { name: "projectImages", maxCount: 10 },
    { name: "demo-video", maxCount: 1 },
    { name: "file", maxCount: 1 }
  ]),
  uploadProject
);
router.post("/:id/like", protect, likeProject);
router.delete("/:id", protect, deleteProject);
router.get("/user/:userId", getProjectsByUser);

module.exports = router;