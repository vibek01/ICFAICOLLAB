// user.routes.js
const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const { getUsers, signup, getMe } = require('../controllers/user.controller');
const router = express.Router();

router.get('/', protect, getUsers); // Fetch all users
router.post('/signup', signup); // Signup endpoint
router.get('/me', protect, getMe); // Fetch logged-in user's data

module.exports = router;