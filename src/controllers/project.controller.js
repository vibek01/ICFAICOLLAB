// project.controller.js
const Project = require("../models/project.model");
const cloudinary = require("../config/cloudinary");

// Utility function to upload a file buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    stream.end(buffer);
  });
};

exports.uploadProject = async (req, res) => {
  try {
    const {
      domain,
      "project-title": title,
      "project-description": description,
      "project-links": projectLinks,
      "team-members": teamMembers,
    } = req.body;

    let fileUrl = "";
    let previewUrl = "";
    let photoUrls = [];

    // Process a single main file if provided (optional)
    if (req.files && req.files['file']) {
      const mainFile = req.files['file'][0];
      fileUrl = await uploadToCloudinary(mainFile.buffer, "project_showcase");
    }

    // Process the preview image (required)
    if (req.files && req.files['previewImage']) {
      const previewFile = req.files['previewImage'][0];
      previewUrl = await uploadToCloudinary(previewFile.buffer, "project_previews");
    }

    // Process multiple project photos
    if (req.files && req.files['projectImages']) {
      const images = req.files['projectImages'];
      photoUrls = await Promise.all(
        images.map(file => uploadToCloudinary(file.buffer, "project_showcase"))
      );
    }

    // Process optional demo video
    let demoVideoUrl = "";
    if (req.files && req.files['demo-video']) {
      const demoFile = req.files['demo-video'][0];
      demoVideoUrl = await uploadToCloudinary(demoFile.buffer, "project_videos");
    }

    // Process comma-separated project links and team members
    const linksArray = projectLinks
      ? projectLinks.split(",").map(link => link.trim()).filter(link => link)
      : [];
    const teamMembersArray = teamMembers
      ? teamMembers.split(",").map(member => member.trim()).filter(member => member)
      : [];

    const project = new Project({
      userId: req.user.id,
      title,
      description,
      domain,
      fileUrl,
      previewUrl,    // Save preview image URL for display as the project preview
      photoUrls,     // Array of additional photo URLs
      projectLinks: linksArray,
      teamMembers: teamMembersArray,
      // Optionally, you can store demoVideoUrl if needed:
      demoVideoUrl,
    });

    await project.save();
    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email username");
    return res.json({ success: true, data: projects });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).populate(
      "userId",
      "name email username"
    );
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "userId",
      "name email username"
    );
    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }
    return res.json({ success: true, data: project });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.likeProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    if (project.likedBy.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        error: "You have already liked this project.",
      });
    }

    project.likedBy.push(req.user.id);
    project.likes += 1;
    await project.save();

    return res.json({ success: true, data: project });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getProjectsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({ userId }).populate(
      "userId",
      "name email username"
    );
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }
    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }
    await project.deleteOne();
    return res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};