// user.routes.js
const express = require('express');
const multer = require('multer');
const { protect } = require('../middlewares/auth.middleware');
const { 
  getUsers, 
  signup, 
  getMe, 
  checkUsername, 
  getUserByUsername,
  updateUser
} = require('../controllers/user.controller');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/signup', upload.single('profilePic'), signup);
router.get('/', protect, getUsers);
router.get('/me', protect, getMe);
router.get('/check-username', checkUsername);
// NEW: Route for updating user details
router.put('/update', protect, updateUser);
// NEW: Route to get user by username (for public profiles)
router.get('/:username', getUserByUsername);

module.exports = router;