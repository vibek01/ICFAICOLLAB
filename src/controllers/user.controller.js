// user.controller.js
const User = require("../models/user.model");
const cloudinary = require("../config/cloudinary");

// Get all users (excluding sensitive fields)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select({ _id: 0, password: 0 });
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// User signup
exports.signup = async (req, res) => {
  try {
    const { name, username, email, password, domains, skills, bio } = req.body;

    if (!username) {
      return res.status(400).json({ success: false, error: "Username is required" });
    }

    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Username is already taken" });
    }

    let domainsArray = [];
    if (typeof domains === "string" && domains.trim().length > 0) {
      domainsArray = domains.split(",").map(d => d.trim());
    }

    let skillsArray = [];
    if (typeof skills === "string" && skills.trim().length > 0) {
      skillsArray = skills.split(",").map(s => s.trim());
    }

    let profilePicUrl = "";
    if (req.file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "user_profiles" },
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
      const uploadResult = await streamUpload(req.file.buffer);
      profilePicUrl = uploadResult.secure_url;
    }

    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email,
      password,
      domains: domainsArray,
      skills: skillsArray,
      bio,
      profilePic: profilePicUrl
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Check if username is available
exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ available: false, error: "Username is required" });
    }
    const user = await User.findOne({ username: username.toLowerCase() });
    return res.json({ available: !user });
  } catch (err) {
    res.status(500).json({ available: false, error: err.message });
  }
};

// Get current user details
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get user by username (for public profiles)
exports.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() }).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// NEW: Update user account details
exports.updateUser = async (req, res) => {
  try {
    const updateFields = {
      name: req.body.name,
      username: req.body.username.toLowerCase(),
      email: req.body.email,
      bio: req.body.bio,
      domains: req.body.domains
        ? req.body.domains.split(",").map(d => d.trim())
        : [],
      skills: req.body.skills
        ? req.body.skills.split(",").map(s => s.trim())
        : []
    };

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateFields, {
      new: true,
      runValidators: true
    });
    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};