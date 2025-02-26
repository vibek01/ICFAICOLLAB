// auth.controller.js
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    // Generate JWT token
    const token = generateToken(user);
    // Set cookie with explicit options (letting it default to the current host)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    return res.json({ success: true, message: 'Logged in successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.logout = (req, res) => {
  // Force the cookie to expire immediately
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0)
  });
  // Add a no-cache header to prevent caching issues
  res.setHeader('Cache-Control', 'no-cache');
  res.json({ success: true, message: 'Logged out successfully' });
};