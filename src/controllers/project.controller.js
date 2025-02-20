// project.controller.js
const Project = require("../models/project.model");

exports.uploadProject = async (req, res) => {
  try {
    const { domain, "project-title": title, "project-description": description } = req.body;
    const fileUrl = req.file ? req.file.path : "";
    
    const project = new Project({
      title,
      description,
      domain,
      fileUrl,
      userId: req.user.id
    });
    
    await project.save();
    return res.status(201).json({ 
      success: true, 
      message: "Project created successfully", 
      data: project 
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    return res.json({ success: true, data: projects });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id })
      .populate('userId', 'name email');
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};