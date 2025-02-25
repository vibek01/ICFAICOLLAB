// user.controller.js
const User = require("../models/user.model");

exports.getUsers = async (req, res) => {
  try {
    // In your user.controller.js getUsers function
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

exports.signup = async (req, res) => {
  try {
    const { name, email, password, domain } = req.body;
    const user = await User.create({ name, email, password, domain });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

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