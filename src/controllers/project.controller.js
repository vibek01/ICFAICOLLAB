// project.controller.js
const Project = require("../models/project.model");
const cloudinary = require("../config/cloudinary");

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

    // If a file is uploaded, use Cloudinary uploader (upload from buffer)
    if (req.file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "project_showcase" }, // Optional: specify a folder in Cloudinary
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          stream.end(buffer);
        });
      };

      const result = await streamUpload(req.file.buffer);
      fileUrl = result.secure_url;
    }

    // Process project links and team members (comma-separated values)
    const linksArray = projectLinks
      ? projectLinks
          .split(",")
          .map((link) => link.trim())
          .filter((link) => link)
      : [];
    const teamMembersArray = teamMembers
      ? teamMembers
          .split(",")
          .map((member) => member.trim())
          .filter((member) => member)
      : [];

    const project = new Project({
      title,
      description,
      domain,
      fileUrl,
      userId: req.user.id,
      projectLinks: linksArray,
      teamMembers: teamMembersArray,
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
      .populate("userId", "name email");
    return res.json({ success: true, data: projects });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).populate(
      "userId",
      "name email"
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
      "name email"
    );
    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }
    return res.json({ success: true, data: project });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};